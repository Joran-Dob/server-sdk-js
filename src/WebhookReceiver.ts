import * as crypto from "https://deno.land/std@0.110.0/node/crypto.ts";
import { TokenVerifier } from './AccessToken.ts';
import { WebhookEvent } from './proto/livekit_webhook.ts';

export const authorizeHeader = 'Authorize';

export class WebhookReceiver {
  private verifier: TokenVerifier;

  constructor(apiKey: string, apiSecret: string) {
    this.verifier = new TokenVerifier(apiKey, apiSecret);
  }

  /**
   *
   * @param body string of the posted body
   * @param authHeader `Authorization` header from the request
   * @param skipAuth true to skip auth validation
   * @returns
   */
  async receive(
    body: string,
    authHeader?: string,
    skipAuth: boolean = false,
  ): Promise<WebhookEvent> {
    // verify token
    if (!skipAuth) {
      if (!authHeader) {
        throw new Error('authorization header is empty');
      }
      const claims = await this.verifier.verify(authHeader);
      // confirm sha
      const hash = crypto.createHash('sha256');
      hash.update(body);

      if (claims.sha256 !== hash.digest('base64')) {
        throw new Error('sha256 checksum of body does not match');
      }
    }

    return WebhookEvent.fromJSON(JSON.parse(body));
  }
}
