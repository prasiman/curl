"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequestWithRetry = exports.tryToParseJson = exports.buildOutput = exports.getAcceptedStatusCodes = void 0;
var requestconf_1 = require("./requestconf");
var core = __importStar(require("@actions/core"));
var axios_1 = __importDefault(require("axios"));
var output_1 = __importDefault(require("./output"));
var rax = __importStar(require("retry-axios"));
var yaml = __importStar(require("js-yaml"));
var getAcceptedStatusCodes = function () {
    var acceptedStatusCodes = requestconf_1.INPUT_ACCEPT
        .split(",")
        .filter(function (x) { return x !== ""; })
        .map(function (x) { return x.trim(); });
    var output = [];
    for (var _i = 0, acceptedStatusCodes_1 = acceptedStatusCodes; _i < acceptedStatusCodes_1.length; _i++) {
        var acceptedStatusCode = acceptedStatusCodes_1[_i];
        if (isNaN(Number(acceptedStatusCode))) {
            throw new Error("Accept status ".concat(acceptedStatusCode, " is invalid"));
        }
        output.push(Number(acceptedStatusCode));
    }
    return output;
};
exports.getAcceptedStatusCodes = getAcceptedStatusCodes;
var buildOutput = function (res) {
    return JSON.stringify({
        status_code: res.status,
        data: res.data,
        headers: res.headers,
    });
};
exports.buildOutput = buildOutput;
var tryToParseJson = function (data) {
    var output = data;
    // try to parse json directly
    try {
        output = JSON.parse(data);
        return output;
    }
    catch (_a) {
        // do nothing
    }
    // try to parse json from yaml
    try {
        output = yaml.load(data, { json: true });
        return output;
    }
    catch (_b) {
        // do nothing
    }
    return data;
};
exports.tryToParseJson = tryToParseJson;
var sendRequestWithRetry = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var client;
    var _a;
    return __generator(this, function (_b) {
        client = axios_1.default.create();
        if (requestconf_1.INPUT_RETRIES) {
            if (isNaN(Number(requestconf_1.INPUT_RETRIES))) {
                throw new Error("retries should be number");
            }
            client.defaults.raxConfig = {
                instance: client,
                retry: Number(requestconf_1.INPUT_RETRIES),
                httpMethodsToRetry: [(_a = config.method) !== null && _a !== void 0 ? _a : ''],
                onRetryAttempt: function (err) {
                    var cfg = rax.getConfig(err);
                    core.info("Retry attempt #".concat(cfg === null || cfg === void 0 ? void 0 : cfg.currentRetryAttempt));
                },
            };
            rax.attach(client);
        }
        client
            .request(config)
            .then(function (resp) { return (0, output_1.default)(resp); })
            .catch(function (err) { return core.setFailed(err); });
        return [2 /*return*/];
    });
}); };
exports.sendRequestWithRetry = sendRequestWithRetry;
//# sourceMappingURL=util.js.map