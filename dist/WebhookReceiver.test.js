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
const livekit_webhook_1 = require("./proto/livekit_webhook");
const WebhookReceiver_1 = require("./WebhookReceiver");
const testApiKey = 'abcdefg';
const testSecret = 'abababa';
describe('webhook receiver', () => {
    const body = '{"event":"room_started", "room":{"sid":"RM_TkVjUvAqgzKz", "name":"mytestroom", "emptyTimeout":300, "creationTime":"1628545903", "turnPassword":"ICkSr2rEeslkN6e9bXL4Ji5zzMD5Z7zzr6ulOaxMj6N", "enabledCodecs":[{"mime":"audio/opus"}, {"mime":"video/VP8"}]}}';
    const sha = 'CoEQz1chqJ9bnZRcORddjplkvpjmPujmLTR42DbefYI=';
    const t = new AccessToken_1.AccessToken(testApiKey, testSecret);
    t.sha256 = sha;
    const token = t.toJwt();
    const receiver = new WebhookReceiver_1.WebhookReceiver(testApiKey, testSecret);
    it('should receive and decode WebhookEvent', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const event = yield receiver.receive(body, yield token);
        expect(event).toBeTruthy();
        expect((_a = event.room) === null || _a === void 0 ? void 0 : _a.name).toBe('mytestroom');
        expect(event.event).toBe('room_started');
    }));
});
describe('decoding json payload', () => {
    it('should allow server to return extra fields', () => {
        var _a;
        const obj = {
            type: 'room_started',
            room: {
                sid: 'RM_TkVjUvAqgzKz',
                name: 'mytestroom',
            },
            extra: 'extra',
        };
        const event = livekit_webhook_1.WebhookEvent.fromJSON(obj);
        expect(event).toBeTruthy();
        expect((_a = event.room) === null || _a === void 0 ? void 0 : _a.name).toBe('mytestroom');
    });
});
//# sourceMappingURL=WebhookReceiver.test.js.map