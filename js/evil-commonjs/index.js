var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var _this = this;
(function () {
    var loadScript = function (src) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var script = document.createElement("script");
                    script.src = src;
                    script.onload = function () { return resolve(); };
                    script.onerror = reject;
                    document.head.appendChild(script);
                })];
        });
    }); };
    var makeAbsoluteUrl = function (base, url) {
        var baseParts = base.split("?")[0].split("/");
        if (4 <= baseParts.length && "" !== baseParts[baseParts.length - 1]) {
            // ファイル名部分の除去
            baseParts = baseParts.slice(0, -1);
        }
        if (4 <= baseParts.length && "" === baseParts[baseParts.length - 1]) {
            // 末尾の空要素を除去(しておかないと結合時に余分に / が挟まる)
            baseParts = baseParts.slice(0, -1);
        }
        var urlParts = url.split("/");
        if (0 <= urlParts[0].indexOf(":")) {
            //  絶対パスなので base 側は全て破棄
            baseParts = [];
        }
        else {
            if ("" === urlParts[0]) {
                urlParts = urlParts.slice(1);
                if ("" === urlParts[0]) {
                    //  プロトコルだけ利用
                    baseParts = baseParts.slice(0, 1);
                }
                else {
                    //  サーバー名まで利用
                    baseParts = baseParts.slice(0, 3);
                }
            }
            else {
                while (true) {
                    if ("." === urlParts[0]) {
                        urlParts = urlParts.slice(1);
                        continue;
                    }
                    if (".." === urlParts[0]) {
                        urlParts = urlParts.slice(1);
                        if (4 <= baseParts.length) {
                            baseParts = baseParts.slice(0, -1);
                        }
                        continue;
                    }
                    break;
                }
            }
        }
        return baseParts.concat(urlParts).join("/");
    };
    var evil = {
        modules: {},
        mapping: {},
        module: {
            registerMapping: function (path, mapping) { return mapping.forEach(function (i) { return evil.mapping[i] = path; }); },
            load: function (path, mapping) { return __awaiter(_this, void 0, void 0, function () {
                var absolutePath;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            absolutePath = makeAbsoluteUrl(location.href, resolveMapping(path));
                            console.log("load(\"" + absolutePath + "\", " + JSON.stringify(mapping) + ")");
                            return [4 /*yield*/, loadScript(absolutePath)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, evil.module.capture(path, mapping)];
                    }
                });
            }); },
            capture: function (path, mapping) {
                if (mapping) {
                    evil.module.registerMapping(path, mapping);
                }
                var absolutePath = makeAbsoluteUrl(location.href, resolveMapping(path));
                window.module.exports.default = window.module.exports.default || window.module.exports;
                var result = evil.modules[absolutePath] = window.module.exports;
                evil.readyToCapture();
                return result;
            },
        },
        readyToCapture: function () { return window.module.exports = window.exports = {}; },
    };
    var resolveMapping = function (path) {
        return evil.mapping[path] || path;
    };
    window.require = function (path) {
        var absolutePath = makeAbsoluteUrl(location.href, resolveMapping(path));
        var result = evil.modules[absolutePath];
        if (!result) {
            console.error("\"" + path + "\" is not found! require() of evil-commonjs need to load() in advance.");
            console.error("loaded modules: \"" + JSON.stringify(Object.keys(evil.modules)) + "\"");
            console.error("module mapping: \"" + JSON.stringify(evil.mapping) + "\"");
        }
        return result;
    };
    window.module = evil.module;
    evil.readyToCapture();
})();
//# sourceMappingURL=index.js.map