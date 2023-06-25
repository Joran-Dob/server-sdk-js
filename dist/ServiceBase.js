"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AccessToken_1 = require("./AccessToken");
/**
 * Utilities to handle authentication
 */
class ServiceBase {
    /**
     * @param apiKey API Key.
     * @param secret API Secret.
     * @param ttl token TTL
     */
    constructor(apiKey, secret, ttl) {
        this.apiKey = apiKey;
        this.secret = secret;
        this.ttl = ttl || '10m';
    }
    authHeader(grant) {
        return __awaiter(this, void 0, void 0, function* () {
            const at = new AccessToken_1.AccessToken(this.apiKey, this.secret, { ttl: this.ttl });
            at.addGrant(grant);
            return {
                Authorization: `Bearer ${yield at.toJwt()}`,
            };
        });
    }
}
exports.default = ServiceBase;
//# sourceMappingURL=ServiceBase.js.map