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
exports.TokenVerifier = exports.AccessToken = void 0;
const jose = __importStar(require("jose"));
// 6 hours
const defaultTTL = `${6 * 60 * 60}s`;
class AccessToken {
    /**
     * Creates a new AccessToken
     * @param apiKey API Key, can be set in env LIVEKIT_API_KEY
     * @param apiSecret Secret, can be set in env LIVEKIT_API_SECRET
     */
    constructor(apiKey, apiSecret, options) {
        if (!apiKey) {
            apiKey = process.env.LIVEKIT_API_KEY;
        }
        if (!apiSecret) {
            apiSecret = process.env.LIVEKIT_API_SECRET;
        }
        if (!apiKey || !apiSecret) {
            throw Error('api-key and api-secret must be set');
        }
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.grants = {};
        this.identity = options === null || options === void 0 ? void 0 : options.identity;
        this.ttl = (options === null || options === void 0 ? void 0 : options.ttl) || defaultTTL;
        if (typeof this.ttl === 'number') {
            this.ttl = `${this.ttl}s`;
        }
        if (options === null || options === void 0 ? void 0 : options.metadata) {
            this.metadata = options.metadata;
        }
        if (options === null || options === void 0 ? void 0 : options.name) {
            this.name = options.name;
        }
    }
    /**
     * Adds a video grant to this token.
     * @param grant
     */
    addGrant(grant) {
        this.grants.video = grant;
    }
    /**
     * Set metadata to be passed to the Participant, used only when joining the room
     */
    set metadata(md) {
        this.grants.metadata = md;
    }
    set name(name) {
        this.grants.name = name;
    }
    get sha256() {
        return this.grants.sha256;
    }
    set sha256(sha) {
        this.grants.sha256 = sha;
    }
    /**
     * @returns JWT encoded token
     */
    toJwt() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: check for video grant validity
            const secret = new TextEncoder().encode(this.apiSecret);
            const jwt = new jose.SignJWT(this.grants)
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuer(this.apiKey)
                .setExpirationTime(this.ttl)
                .setNotBefore(0);
            if (this.identity) {
                jwt.setSubject(this.identity);
                jwt.setJti(this.identity);
            }
            else if ((_a = this.grants.video) === null || _a === void 0 ? void 0 : _a.roomJoin) {
                throw Error('identity is required for join but not set');
            }
            return jwt.sign(secret);
        });
    }
}
exports.AccessToken = AccessToken;
class TokenVerifier {
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }
    verify(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = new TextEncoder().encode(this.apiSecret);
            const { payload } = yield jose.jwtVerify(token, secret, { issuer: this.apiKey });
            if (!payload) {
                throw Error('invalid token');
            }
            return payload;
        });
    }
}
exports.TokenVerifier = TokenVerifier;
//# sourceMappingURL=AccessToken.js.map