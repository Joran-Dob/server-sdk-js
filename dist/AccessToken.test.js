"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jose = __importStar(require("jose"));
const AccessToken_1 = require("./AccessToken");
const testApiKey = 'abcdefg';
const testSecret = 'abababa';
describe('encoded tokens are valid', () => {
    const t = new AccessToken_1.AccessToken(testApiKey, testSecret, {
        identity: 'me',
        name: 'myname',
    });
    t.addGrant({ room: 'myroom' });
    const EncodedTestSecret = new TextEncoder().encode(testSecret);
    it('can be decoded', () => __awaiter(void 0, void 0, void 0, function* () {
        const { payload } = yield jose.jwtVerify(yield t.toJwt(), EncodedTestSecret, { issuer: testApiKey });
        expect(payload).not.toBe(undefined);
    }));
    it('has name set', () => __awaiter(void 0, void 0, void 0, function* () {
        const { payload } = yield jose.jwtVerify(yield t.toJwt(), EncodedTestSecret, { issuer: testApiKey });
        expect(payload.name).toBe('myname');
    }));
    it('has video grants set', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { payload } = yield jose.jwtVerify(yield t.toJwt(), EncodedTestSecret, { issuer: testApiKey });
        expect(payload.video).toBeTruthy();
        expect((_a = payload.video) === null || _a === void 0 ? void 0 : _a.room).toEqual('myroom');
    }));
});
describe('identity is required for only join grants', () => {
    it('allows empty identity for create', () => __awaiter(void 0, void 0, void 0, function* () {
        const t = new AccessToken_1.AccessToken(testApiKey, testSecret);
        t.addGrant({ roomCreate: true });
        expect(yield t.toJwt()).toBeTruthy();
    }));
    it('throws error when identity is not provided for join', () => __awaiter(void 0, void 0, void 0, function* () {
        const t = new AccessToken_1.AccessToken(testApiKey, testSecret);
        t.addGrant({ roomJoin: true });
        yield expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield t.toJwt();
        })).rejects.toThrow();
    }));
});
describe('verify token is valid', () => {
    it('can decode encoded token', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const t = new AccessToken_1.AccessToken(testApiKey, testSecret);
        t.sha256 = 'abcdefg';
        t.addGrant({ roomCreate: true });
        const v = new AccessToken_1.TokenVerifier(testApiKey, testSecret);
        const decoded = yield v.verify(yield t.toJwt());
        expect(decoded).not.toBe(undefined);
        expect(decoded.sha256).toEqual('abcdefg');
        expect((_a = decoded.video) === null || _a === void 0 ? void 0 : _a.roomCreate).toBeTruthy();
    }));
});
//# sourceMappingURL=AccessToken.test.js.map