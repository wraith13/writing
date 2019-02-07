'use strict';
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
                var absolutePath, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            absolutePath = makeAbsoluteUrl(location.href, resolveMapping(path));
                            window.module.readyToCapture();
                            console.log("load(\"" + absolutePath + "\", " + JSON.stringify(mapping) + ")");
                            return [4 /*yield*/, loadScript(absolutePath)];
                        case 1:
                            _a.sent();
                            result = evil.module.capture(path, mapping);
                            return [2 /*return*/, result];
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
                window.module.pauseCapture();
                return result;
            },
            readyToCapture: function () { return window.module.exports = window.exports = {}; },
            pauseCapture: function () { return window.exports = undefined; },
            exports: {},
        },
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
})();
var hljs;
var Reveal;
(function () {
    var _this = this;
    var globalState = {
        "config": {}
    };
    var explicitFragmentIdPattern = /\{\#(.*?)\}$/;
    var timeout = function (wait) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_c) {
        return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, wait); })];
    }); }); };
    var tryOrThrough = function (title, f) {
        try {
            f();
        }
        catch (err) {
            console.error("\uD83D\uDEAB " + title + ": " + err);
        }
    };
    var tryOrThroughAsync = function (title, f) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, f()];
                    case 1:
                        _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _c.sent();
                        console.error("\uD83D\uDEAB " + title + ": " + err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var objectAssign = function (target, source) {
        //  copy from https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
        if (typeof Object.assign !== 'function') {
            (function () {
                Object.assign = function (target) {
                    'use strict';
                    if (target === undefined || target === null) {
                        throw new TypeError('Cannot convert undefined or null to object');
                    }
                    var output = Object(target);
                    for (var index = 1; index < arguments.length; index++) {
                        var source_1 = arguments[index];
                        if (source_1 !== undefined && source_1 !== null) {
                            for (var nextKey in source_1) {
                                if (Object.prototype.hasOwnProperty.call(source_1, nextKey)) {
                                    output[nextKey] = source_1[nextKey];
                                }
                            }
                        }
                    }
                    return output;
                };
            })();
        }
        Object.assign(target, source);
        return target;
    };
    var deepCopy = function (source) { return JSON.parse(JSON.stringify(source)); };
    var recursiveAssign = function (target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                var value = source[key];
                if ("object" === practicalTypeof(value)) {
                    if (undefined === target[key]) {
                        target[key] = {};
                    }
                    recursiveAssign(target[key], value);
                }
                else {
                    target[key] = value;
                }
            }
        }
    };
    var practicalTypeof = function (obj) {
        if (undefined === obj) {
            return "undefined";
        }
        if (null === obj) {
            return "null";
        }
        if ("[object Array]" === Object.prototype.toString.call(obj)) {
            return "array";
        }
        return typeof obj;
    };
    var makeDomNode = function (arg) {
        if (arg instanceof Node) {
            return arg;
        }
        if ("string" === practicalTypeof(arg)) {
            return document.createTextNode(arg);
        }
        return setToElement(document.createElement(arg.tag), arg);
    };
    var setToElement = function (element, arg) {
        for (var key in arg) {
            if (arg.hasOwnProperty(key)) {
                switch (key) {
                    case "tag":
                    case "parent":
                    case "children":
                    case "attributes":
                    case "eventListener":
                        //  nop
                        break;
                    default:
                        var value = arg[key];
                        if (undefined !== value) {
                            if ("object" === practicalTypeof(value)) {
                                recursiveAssign(element[key], value);
                            }
                            else {
                                element[key] = value;
                            }
                        }
                        break;
                }
            }
        }
        if (undefined !== arg.attributes) {
            for (var key in arg.attributes) {
                if (arg.attributes.hasOwnProperty(key)) {
                    element.setAttribute(key, arg.attributes[key]);
                    //  memo: value を持たない attribute を設定したい場合には value として "" を指定すれば良い。
                }
            }
        }
        if (undefined !== arg.children) {
            if ("array" === practicalTypeof(arg.children)) {
                arg.children.forEach(function (i) { return element.appendChild(makeDomNode(i)); });
            }
            else {
                element.appendChild(makeDomNode(arg.children));
            }
        }
        if (undefined !== arg.eventListener) {
            for (var key in arg.eventListener) {
                if (arg.eventListener.hasOwnProperty(key)) {
                    element.addEventListener(key, arg.eventListener[key]);
                }
            }
        }
        if (undefined !== arg.parent) {
            arg.parent.appendChild(element);
        }
        return element;
    };
    var hideSystemLoadingError = function () {
        document.body.classList.remove("writing-HTML-system-loading-error");
        document.body.classList.add("writing-HTML-document-loading");
        console.log("✅ system loading succeeded.");
    };
    var hideLoading = function () {
        document.body.classList.remove("writing-HTML-document-loading");
        document.body.classList.add("writing-HTML-document-rendering");
    };
    var hideRendering = function (withError) {
        if (withError === void 0) { withError = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        hideLoading();
                        if (!globalState.config.disabledRenderingAnimation) return [3 /*break*/, 1];
                        document.body.classList.remove("writing-HTML-document-rendering");
                        return [3 /*break*/, 4];
                    case 1:
                        document.body.classList.add("writing-HTML-document-rendering-slide-out");
                        return [4 /*yield*/, timeout(290)];
                    case 2:
                        _c.sent();
                        document.body.classList.remove("writing-HTML-document-rendering");
                        document.body.classList.remove("writing-HTML-document-rendering-slide-out");
                        return [4 /*yield*/, timeout(100)];
                    case 3:
                        _c.sent();
                        applyFragmentId();
                        if (globalState.activateOnScroll) {
                            globalState.activateOnScroll();
                        }
                        _c.label = 4;
                    case 4:
                        if (!withError) {
                            console.log("✅ document rendering succeeded.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    var showRenderingError = function () {
        var _this = this;
        document.body.classList.add("writing-HTML-document-rendering-error");
        //  画面をクリックしたら復元(エラーがあってもとにかく表示された方が嬉しい場面もあるので)
        document.getElementById("writing-HTML-document-rendering-error-panel").onclick = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        document.body.classList.remove("writing-HTML-document-rendering-error");
                        return [4 /*yield*/, hideRendering()];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); };
    };
    var makeErrorDiv = function (arg) {
        return makeDomNode({
            tag: "div",
            style: {
                color: "#AA3322",
                backgroundColor: "#442211",
                fontSize: "1.5rem",
                padding: "0.4rem",
                textAlign: "center",
            },
            children: arg,
        });
    };
    var showError = function (arg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        recursiveAssign(document.body.style, {
                            margin: "0px",
                        });
                        document.body.appendChild(makeErrorDiv(arg));
                        return [4 /*yield*/, hideRendering(true)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var showLoadingError = function (sourceUrl, request) {
        hideSystemLoadingError();
        showError([
            "loading failed: { \"method\": \"GET\", \"url\": \"",
            {
                tag: "a",
                href: sourceUrl,
                style: {
                    color: "#6666FF",
                },
                children: sourceUrl,
            },
            "\", \"status\": " + request.status + "};"
        ]);
        var responseDiv = {
            parent: document.body,
            tag: "div",
        };
        if (request.responseText) {
            responseDiv.innerHTML = request.responseText;
        }
        else {
            responseDiv.style =
                {
                    whiteSpace: "pre-wrap",
                    fontSize: "1.5rem",
                    padding: "20px",
                };
            if (0 === request.status) {
                responseDiv.innerText = "There ia a possibility that server not found or it happened cross-domain issue.\nサーバーが見つからないかクロスドメインの問題が発生した可能性があります。";
            }
            else {
                responseDiv.innerText = JSON.stringify(request.getAllResponseHeaders(), null, 4);
            }
        }
        makeDomNode(responseDiv);
    };
    var appendLink = function (args) { return makeDomNode(objectAssign(deepCopy(args), {
        parent: document.head,
        tag: "link"
    })); };
    var appendTheme = function (href, id) {
        if (id === void 0) { id = undefined; }
        return appendLink({
            rel: "stylesheet",
            type: "text/css",
            href: href,
            id: id
        });
    };
    var appendHighlightTheme = function () { return appendTheme("//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css"); };
    var appendIcon = function (href) {
        appendLink({
            rel: "shortcut icon",
            type: "image/x-icon",
            href: href,
        });
        appendLink({
            rel: "apple-touch-icon",
            type: undefined,
            href: href,
        });
        document.getElementById("twitter-card-image").content = href;
    };
    var loadScript = function (src) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_c) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return makeDomNode({
                    parent: document.head,
                    tag: "script",
                    src: src,
                    onload: resolve,
                    onerror: reject,
                }); })];
        });
    }); };
    //const loadModule = (url: string, mapping ? : string[]) =>  window.module.load(makeSystemUrl(url), mapping);
    var loadModule = function (url, mapping) {
        if ("@" === url.substr(0, 1)) {
            return window.module.load(makeSystemUrl(url), mapping ?
                mapping.concat(url.substr(1)) :
                [url.substr(1)]);
        }
        else {
            return window.module.load(url, mapping);
        }
    };
    var loadHighlightScript = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, loadModule("//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js")];
                    case 1:
                        hljs = _c.sent();
                        hljs.initHighlightingOnLoad();
                        applyHighlight();
                        return [2 /*return*/];
                }
            });
        });
    };
    var loadMathJaxScript = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, loadScript("//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML")];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var loadTwitterScript = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, loadScript("//platform.twitter.com/widgets.js")];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var makeSystemUrl = function (url) { return makeAbsoluteUrl(null, url); };
    var makeAbsoluteUrl = function (base, url) {
        if ("@" === url.substr(0, 1)) {
            return makeAbsoluteUrl(globalState.systemRootUrl || location.href, url.substr(1));
        }
        if ("#" === url.substr(0, 1)) {
            return base.split("#")[0] + url;
        }
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
    var makeBaseRelativeUrl = function (base, url) {
        while ("@" === url.substr(0, 1)) {
            url = url.substr(1);
        }
        if ("#" === url.substr(0, 1)) {
            return base.split("#")[0] + url;
        }
        if (base === url.split("#")[0]) {
            return url;
        }
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
        var matchLength = 0;
        while (matchLength < baseParts.length &&
            matchLength < urlParts.length &&
            baseParts[matchLength] === urlParts[matchLength]) {
            ++matchLength;
        }
        switch (matchLength) {
            case 0:
                break;
            case 1: // 1 になることは通常あり得なくて 1 になることがあるとしたら恐らくどこかのバグ
            case 2:
                urlParts = [""].concat(urlParts.slice(1));
                break;
            default:
                urlParts = urlParts.slice(matchLength);
                break;
        }
        if (2 < matchLength) {
            while (matchLength++ < baseParts.length) {
                urlParts = [".."].concat(urlParts);
            }
        }
        var result = urlParts.join("/");
        if ("" === result) {
            result = ".";
        }
        return result;
    };
    var makeRelativeUrl = function (url) {
        return makeBaseRelativeUrl(globalState.config.baseUrl, url);
    };
    var makeSystemRelativeUrl = function (url) {
        return makeBaseRelativeUrl(location.href.split("#")[0], url);
    };
    var makeRebaseUrl = function (base, url) {
        if ("#" === url.substr(0, 1)) {
            return url;
        }
        return makeSystemRelativeUrl(makeAbsoluteUrl(base, url));
    };
    var skipEscape = function (lines, map, escapeMap) {
        if (escapeMap === void 0) { escapeMap = undefined; }
        var currentEscape = null;
        var currentLanguage = null;
        return lines.map(function (line, line_number) {
            var escape = "$$" === line.trim() ? "$$" : line.trim().replace(/^(```+|~~~+).*/, "$1").replace(/^[`~]{0,2}(([^`~].*)|$)/, "");
            var isEscape = null === currentEscape && ("" !== escape) || (null !== currentEscape && currentEscape.substr(0, 1) === escape.substr(0, 1) && currentEscape.length <= escape.length);
            if (isEscape) {
                if (null === currentEscape) {
                    currentEscape = escape;
                    currentLanguage = line.trim().replace(escape, "").trim();
                }
                else {
                    // ここでこういう処理を挟むのは行儀が悪いけど、閉じが長すぎる場合にここで整形してしまう。
                    line = currentEscape;
                    currentEscape = null;
                    currentLanguage = null;
                }
            }
            if (null === currentEscape || isEscape) {
                if (map) {
                    line = map(line, line_number, currentLanguage);
                }
            }
            else {
                if (escapeMap) {
                    line = escapeMap(line, line_number, currentLanguage);
                }
            }
            return line;
        });
    };
    var skipEscapeBlock = function (source, map, escapeMap, finish) {
        if (escapeMap === void 0) { escapeMap = undefined; }
        if (finish === void 0) { finish = undefined; }
        var blocks = [];
        var current = [];
        var isInEscape = false;
        skipEscape(source.split("\n"), function (line, _line_number, _language) {
            if (isInEscape) {
                var currentBlock = current.join("\n");
                blocks.push(escapeMap ?
                    escapeMap(currentBlock) :
                    currentBlock);
                isInEscape = false;
                current = [];
            }
            current.push(line);
            return line;
        }, function (line, _line_number, _language) {
            if (!isInEscape) {
                var currentBlock = current.join("\n");
                blocks.push(map ?
                    map(currentBlock) :
                    currentBlock);
                isInEscape = true;
                current = [];
            }
            current.push(line);
            return line;
        });
        if (!isInEscape) {
            var currentBlock = current.join("\n");
            blocks.push(map ?
                map(currentBlock) :
                currentBlock);
        }
        else {
            //  ここにくるのは code escape が閉じてない時だけなので、基本的には到達してはいけない。
            var currentBlock = current.join("\n");
            blocks.push(escapeMap ?
                escapeMap(currentBlock) :
                currentBlock);
        }
        if (undefined !== finish) {
            finish();
        }
        return blocks.join("\n");
    };
    var applyMermaid = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            var mermaidLanguageName, hasMermaidCode, lines, currentBlock_1, currentLanguage_1, mermaid_1, mermaidCount_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        mermaidLanguageName = "mermaid";
                        hasMermaidCode = false;
                        lines = source.split("\n");
                        skipEscape(lines, function (line, _line_number, language) {
                            if (mermaidLanguageName === language) {
                                hasMermaidCode = true;
                            }
                            return line;
                        });
                        if (!hasMermaidCode) return [3 /*break*/, 2];
                        currentBlock_1 = [];
                        currentLanguage_1 = null;
                        return [4 /*yield*/, loadModule("@js/mermaid@8.0.0/mermaid.min.js")];
                    case 1:
                        mermaid_1 = _c.sent();
                        mermaid_1.initialize({ startOnLoad: false, theme: 'forest' });
                        mermaidCount_1 = 0;
                        return [2 /*return*/, skipEscape(lines, function (line, _line_number, language) {
                                if (mermaidLanguageName === currentLanguage_1) {
                                    var mermaidSource = currentBlock_1.join("\n");
                                    currentLanguage_1 = language;
                                    currentBlock_1 = [];
                                    var temporaryDiv = document.createElement("div");
                                    temporaryDiv.id = "mermaid-" + mermaidCount_1++;
                                    temporaryDiv.style.maxWidth = "60rem";
                                    temporaryDiv.innerHTML = mermaidSource;
                                    document.body.appendChild(temporaryDiv);
                                    try {
                                        mermaid_1.init({ noteMargin: 10 }, "#" + temporaryDiv.id);
                                    }
                                    catch (error) {
                                        var errorDiv = makeErrorDiv("🚫 ERROR: mermaid is not support your web browser...");
                                        errorDiv.style.textAlign = "left";
                                        temporaryDiv.innerHTML = errorDiv.outerHTML;
                                        console.error("\uD83D\uDEAB mermaid: " + error);
                                    }
                                    var svg = temporaryDiv.innerHTML;
                                    document.body.removeChild(temporaryDiv);
                                    return svg
                                        .replace("<svg ", "<svg class=\"writing-mermaid\" ")
                                        .replace("height=\"100%\"", ""); // height の指定を除去してやらないと上下にめっちゃ無駄なマージンがついてしまう。
                                    //本来的には↓このコードで上手く動作して欲しいが、これだと画面全体が使えることを前提としてフォントサイズが小さすぎる状態でレンダリングされてしまう。
                                    //return mermaid.render(`mermaid-${Date.now()}`, mermaidSource).replace("height=\"100%\"", "");
                                }
                                else {
                                    currentLanguage_1 = language;
                                    if (mermaidLanguageName === currentLanguage_1) {
                                        return null;
                                    }
                                    else {
                                        return line;
                                    }
                                }
                            }, function (line, _line_number, _language) {
                                if (mermaidLanguageName === currentLanguage_1) {
                                    currentBlock_1.push(line);
                                    return null;
                                }
                                else {
                                    return line;
                                }
                            })
                                .filter(function (line) { return null !== line; })
                                .join("\n")];
                    case 2: return [2 /*return*/, source];
                }
            });
        });
    };
    var applyOption = function (source, TAG, applyer, finish) {
        if (finish === void 0) { finish = undefined; }
        return skipEscapeBlock(source, function (block) {
            var reg = new RegExp("<!--\\[" + TAG + "\\]\\s*([\\s\\S]*?)\\s*-->", "gm");
            var matches = null;
            while (matches = reg.exec(block)) {
                applyer(matches[1]);
            }
            return block.replace(reg, "");
        }, undefined, finish);
    };
    var loadConfig = function (source) {
        return applyOption(source, "WRTING-CONFING", function (option) {
            try {
                objectAssign(globalState.documentConfig, JSON.parse(option));
            }
            catch (err) {
                console.error(err);
                console.error("error WRTING-CONFING: " + option);
            }
        });
    };
    var MarkdownHeaderFragmentMaker = /** @class */ (function () {
        function MarkdownHeaderFragmentMaker() {
            this.links = [];
        }
        MarkdownHeaderFragmentMaker.prototype.makeFragment = function (line) {
            var explicitFragmentIdMatch = line.match(explicitFragmentIdPattern);
            var link = explicitFragmentIdMatch ?
                explicitFragmentIdMatch[1] :
                line
                    .replace(/^#*/, "")
                    .replace(/!\[(.*?)\]\(.*?\)/g, "$1")
                    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
                    .replace(/(^|[^\\])<[^\>]*?[^\\]>/g, "$1") // エスケープを避けつつ適切に処理する為にはこの置換は2回行う必要がある。(3回は必要ない2回で十分)
                    .replace(/(^|[^\\])<[^\>]*?[^\\]>/g, "$1")
                    .trim()
                    .toLowerCase()
                    .replace(/[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/g, "")
                    .replace(/ /g, "-");
            var index = this.links[link];
            if (undefined === index) {
                this.links[link] = 0;
                return link;
            }
            else {
                ++index;
                this.links[link] = index;
                return link + "-" + index;
            }
        };
        return MarkdownHeaderFragmentMaker;
    }());
    var getAllElements = function (parent) {
        if (parent === void 0) { parent = document; }
        var result = [];
        if (parent.children) {
            Array.from(parent.children).forEach(function (i) {
                result.push(i);
                result = result.concat(getAllElements(i));
            });
        }
        return result;
    };
    var getHeadingTags = function () {
        return getAllElements(document.body).filter(function (i) { return /^h\d+$/i.test(i.tagName); });
    };
    var IndexItem = /** @class */ (function () {
        function IndexItem(level, title, link, anchor) {
            if (anchor === void 0) { anchor = null; }
            this.level = level;
            this.title = title;
            this.link = link;
            this.anchor = anchor;
        }
        return IndexItem;
    }());
    var makeIndexFromContent = function () {
        var linkMaker = new MarkdownHeaderFragmentMaker();
        var anchors = [];
        getHeadingTags().forEach(function (i) {
            var level = parseInt(i.tagName.substr(1), 10);
            var title = i.textContent.trim();
            if (!i.id) {
                i.id = linkMaker.makeFragment(title);
            }
            var link = "#" + i.id;
            anchors.push(new IndexItem(level, title, link));
        });
        return anchors;
    };
    var translateRelativeUrl = function (baseUrl, url) {
        if ("?" === url.substr(0, 1)) {
            return url + "&" + encodeURIComponent(makeRelativeUrl(baseUrl));
        }
        else if ("#" !== url.substr(0, 1)) {
            var absoluteUrl = makeAbsoluteUrl(baseUrl, url);
            var relativeUrl = makeRelativeUrl(absoluteUrl);
            if (/.*\.md(\.txt)?(#.*)?$/i.test(absoluteUrl)) {
                var thisPath = globalState.documentBaseUrl.split("#")[0].split("?")[0];
                if (thisPath !== absoluteUrl.split("#")[0].split("?")[0]) {
                    var systemRelativeUrl = "@" + makeSystemRelativeUrl(absoluteUrl);
                    return "?" + encodeURIComponent(relativeUrl.length <= systemRelativeUrl.length ?
                        relativeUrl :
                        systemRelativeUrl);
                }
            }
            else {
                return relativeUrl;
            }
        }
        return url;
    };
    var translateRelativeLink = function (baseUrl, source) {
        return skipEscape(source.split("\n"), function (line) {
            var isInInlineEscape = false;
            var isInSquareBracket = false;
            return line.split("`").map(function (part) {
                if (!isInInlineEscape) {
                    var match = null;
                    if (isInSquareBracket) {
                        isInSquareBracket = false;
                        var re_1 = /(.*?[^\\])?\]\((.*?[^\\])\)/g;
                        if (null !== (match = re_1.exec(part))) {
                            var label = undefined === match[1] ? "" : match[1];
                            var url = match[2];
                            var traslatedUrl = translateRelativeUrl(baseUrl, url);
                            if (url !== traslatedUrl) {
                                part = part.replace(match[0], label + "](" + traslatedUrl + ")");
                            }
                        }
                    }
                    var re = /(^|[^\\])\[(.*?[^\\])?\]\((.*?[^\\])\)/g;
                    while (null !== (match = re.exec(part))) {
                        var label = undefined === match[2] ? "" : match[2];
                        var url = match[3];
                        var traslatedUrl = translateRelativeUrl(baseUrl, url);
                        if (url !== traslatedUrl) {
                            part = part.replace(match[0], match[1] + "[" + label + "](" + traslatedUrl + ")");
                        }
                    }
                    if (/(^|[^\\])\]/.test(part)) {
                        isInSquareBracket = false;
                    }
                    if (/\[([^\]]|\\\])*$/.test(part)) {
                        isInSquareBracket = true;
                    }
                    var img_re = /\<(\s*)img(\s.*?)src=([\"\'])(.*?)([\"\'].*?)\>/g;
                    while (null !== (match = img_re.exec(part))) {
                        var url = match[4];
                        var absoluteUrl = makeAbsoluteUrl(baseUrl, url);
                        var relativeUrl = makeSystemRelativeUrl(absoluteUrl); // 画像をいまこの場で表示する必要があるので、 makeRelativeUrl ではなく makeSystemRelativeUrl でなければならない。
                        part = part.replace(match[0], "<" + match[1] + "img" + match[2] + "src=" + match[3] + relativeUrl + match[5] + ">");
                    }
                }
                if ("\\" !== part.substring(-1)) {
                    isInInlineEscape = !isInInlineEscape;
                }
                return part;
            }).join("`");
        }).join("\n");
    };
    var translateLinkWithinPageForRemark = function (source) {
        var lines = source.split("\n");
        var anchors = [];
        var page = 1;
        var isLayout = false;
        skipEscape(lines, function (line) {
            var trimed_line = line.trim();
            if ("--" === line || "---" === line) {
                if (!isLayout) {
                    ++page;
                }
                isLayout = false;
            }
            else if (/^#+ [^ ]+/.test(trimed_line)) {
                var anchor = trimed_line.replace(/^#*/, "").trim().toLowerCase().replace(/[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/g, "").replace(/ /g, "-");
                anchors.push({
                    anchor: "](#" + anchor + ")",
                    page: "](#" + page + ")"
                });
            }
            else if ("layout:" === trimed_line.slice(0, 7) && "true" === trimed_line.slice(7).trim()) {
                isLayout = true;
            }
            return line;
        });
        return skipEscape(lines, function (line) {
            anchors.forEach(function (i) { return line = line.split(i.anchor).join(i.page); });
            return line;
        }).join("\n");
    };
    var translateLinkWithinPageForReveal = function (source) {
        var lines = source.split("\n");
        var anchors = [];
        var page = 0;
        skipEscape(lines, function (line) {
            var trimed_line = line.trim();
            if ("--" === line || "---" === line) {
                ++page;
            }
            else if (/^#+ [^ ]+/.test(trimed_line)) {
                var anchor = trimed_line.replace(/^#*/, "").trim().toLowerCase().replace(/[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/g, "").replace(/ /g, "-");
                anchors.push({
                    anchor: "](#" + anchor + ")",
                    page: "](#/" + page + ")"
                });
            }
            return line;
        });
        return skipEscape(lines, function (line) {
            anchors.forEach(function (i) { return line = line.split(i.anchor).join(i.page); });
            return line;
        }).join("\n");
    };
    var translateForSlide = function (source) {
        globalState.config.autoPageSeparate =
            undefined === globalState.config.autoPageSeparate ?
                "auto" :
                globalState.config.autoPageSeparate;
        console.log("autoPageSeparate: " + globalState.config.autoPageSeparate);
        if (true === globalState.config.autoPageSeparate ||
            (false !== globalState.config.autoPageSeparate &&
                !/\n---\n/.test(source))) {
            var lines = source.split("\n");
            var h1Count_1 = 0;
            skipEscape(lines, function (line) {
                var trimed_line = line.trim();
                if (/^# [^ ]+/.test(trimed_line)) {
                    ++h1Count_1;
                }
                return line;
            });
            var isFirst_1 = true;
            var withJackUp_1 = 1 < h1Count_1;
            return skipEscape(lines, function (line) {
                var trimed_line = line.trim();
                if (/^#+ [^ ]+/.test(trimed_line)) {
                    if (!isFirst_1) {
                        if (withJackUp_1) {
                            line = "#" + trimed_line;
                        }
                        line = "---\n" + line;
                    }
                    isFirst_1 = false;
                }
                return line;
            }).join("\n");
        }
        else {
            return source;
        }
    };
    var translateForMathJax = function (source) { return source.replace(/\n\$\$\n([\W\w]*?)\n\$\$\n/g, "\n<pre class=\"mathjax\">\n$$$$\n$1\n$$$$\n</pre>\n"); };
    var applyTitle = function (source) {
        if (undefined === globalState.config.title || "" === globalState.config.title) {
            var matches = /(^|\n)#\s+(.*)([\W\w]*)/.exec(source);
            if (matches) {
                globalState.config.title = matches[2];
            }
            if (undefined === globalState.config.title || "" === globalState.config.title) {
                var context_1 = {
                    previousLine: undefined
                };
                skipEscape(source.split("\n"), function (line) {
                    if (undefined === globalState.config.title || "" === globalState.config.title) {
                        if (line.match(/^\=+$/) && (undefined !== context_1.previousLine && "" !== context_1.previousLine)) {
                            globalState.config.title = context_1.previousLine;
                        }
                        context_1.previousLine = line;
                    }
                    return line;
                });
            }
            if (undefined === globalState.config.title || "" === globalState.config.title) {
                globalState.config.title =
                    (source
                        .split("\n---\n")[0]
                        .replace(/([\W\w]*?)(\n?#+\s+)/, "$2")
                        .replace(/(^|\n)#+\s+(.*)([\W\w]*)/, "$2")
                        .replace(/<.*?>/g, "")
                        .split("\n")
                        .map(function (i) { return i.trim(); })
                        .filter(function (i) { return 0 < i.length; })[0]
                        || "untitled")
                        .replace(/\s+/g, " ")
                        .slice(0, 64);
            }
            globalState.config.title = globalState.config.title
                .replace(/!\[(.*?)\]\(.*?\)/g, "")
                .replace(/\[(.*?)\]\(.*?\)/g, "$1")
                .replace(/<!--.*?-->/g, "")
                .replace(/&lt;/, "<")
                .replace(/&gt;/, ">");
        }
        document.title = globalState.config.title;
        document.getElementById("twitter-card-title").content = globalState.config.title;
    };
    var applyIcon = function (baseUrl) { return appendIcon(globalState.config.favicon ?
        makeAbsoluteUrl(baseUrl, globalState.config.favicon) :
        makeAbsoluteUrl(location.href, "writinghex.128.png")); };
    var applyTheme = function (baseUrl) {
        return (globalState.config.theme || ["@theme/default.css"]).forEach(function (i) { return appendTheme(makeRebaseUrl(baseUrl, i)); });
    };
    var applyStyle = function (source) { return applyOption(source, "STYLE", function (option) { return makeDomNode({
        parent: document.head,
        tag: "style",
        innerHTML: option,
    }); }); };
    var applyWallPaper = function (baseUrl) {
        if (globalState.config.wallpaper) {
            document.body.classList.add("with-wallpaper");
            makeDomNode({
                parent: document.body,
                tag: "div",
                className: "wallpaper",
                style: {
                    backgroundImage: "url(\"" + makeRebaseUrl(baseUrl, globalState.config.wallpaper) + "\")",
                },
            });
        }
    };
    var applyIndex = function (_source) {
        var index = null;
        var contentDiv = document.getElementsByClassName("content")[0];
        var isSmallDocument = contentDiv.clientHeight < document.body.clientHeight;
        if (((undefined === globalState.config.withIndex || null === globalState.config.withIndex) && !isSmallDocument) || globalState.config.withIndex) {
            index = makeIndexFromContent();
            if (index && 0 < index.length) {
                document.body.classList.add("with-index");
                document.body.insertBefore(makeDomNode({
                    tag: "div",
                    className: "index-frame",
                    children: {
                        tag: "div",
                        className: "index",
                        onmouseenter: function () { globalState.isMouseOnIndex = true; },
                        onmouseleave: function () { globalState.isMouseOnIndex = false; },
                        children: index.map(function (i) {
                            return i.anchor = makeDomNode({
                                tag: "a",
                                className: "level" + i.level,
                                href: i.link,
                                innerText: i.title,
                            });
                        })
                    }
                }), contentDiv);
                makeDomNode({
                    parent: contentDiv,
                    tag: "div",
                    style: { height: "90vh", },
                });
                //  index script
                applyIndexScript(index);
            }
            else {
                index = null;
            }
        }
        return index;
    };
    var applyIndexScript = function (index) {
        if (index) {
            index[0].anchor.classList.add("current");
            var previousState_1 = { i: 0 }; // 本来は -1 で初期化するべきだが、それだと後ろの setTimeout(document.body.onscroll, 0); による初期表示が意図通りに機能しないので 0 にしてる。 
            var isOver_1 = function (i) {
                return index.length <= i ||
                    (0 <= i && 32 < document.getElementById(index[i].link.substring(1)).getBoundingClientRect().top);
            };
            var previousContent = null;
            for (var i in index) {
                var content = document.getElementById(index[i].link.substring(1));
                if (!content) {
                    console.log("not found: " + index[i].link);
                    index[i].withError = true;
                }
                else if (previousContent && content.getBoundingClientRect().top < previousContent.getBoundingClientRect().top) {
                    console.log("may be duplicated id: " + index[i].link);
                    index[i].withError = true;
                }
                if (!index[i].withError) {
                    previousContent = content;
                }
            }
            index = index.filter(function (i) { return !i.withError; });
            if (0 < index.length) {
                globalState.activateOnScroll = function () {
                    document.body.onscroll =
                        document.documentElement.onscroll = // これは IE 用
                            function () {
                                var previouseContetIsOver = isOver_1(previousState_1.i);
                                var nextContetIsOver = isOver_1(previousState_1.i + 1);
                                if (previouseContetIsOver || !nextContetIsOver) {
                                    if (previouseContetIsOver) {
                                        //  上へ手繰る
                                        while (isOver_1(--previousState_1.i)) { }
                                    }
                                    else {
                                        // 下へ手繰る
                                        while (!isOver_1((++previousState_1.i) + 1)) { }
                                    }
                                    var targetIndex = previousState_1.i < 0 ? null : index[previousState_1.i];
                                    var current = document.getElementsByClassName("current")[0];
                                    if (current !== (null === targetIndex ? null : targetIndex.anchor)) {
                                        if (current) {
                                            current.classList.remove("current");
                                        }
                                        if (targetIndex) {
                                            targetIndex.anchor.classList.add("current");
                                            window.history.replaceState(null, targetIndex.title, targetIndex.link);
                                        }
                                        else {
                                            index[0].anchor.classList.add("current");
                                            window.history.replaceState(null, document.title, "#");
                                        }
                                        if (!globalState.isMouseOnIndex) {
                                            var frame = document.getElementsByClassName("index-frame")[0];
                                            if (null === targetIndex) {
                                                frame.scrollTop = 0;
                                            }
                                            else {
                                                var rect = targetIndex.anchor.getBoundingClientRect();
                                                var targetTop = rect.top + frame.scrollTop;
                                                frame.scrollTop = targetTop - Math.min(frame.clientHeight - rect.height, ((targetTop / frame.scrollHeight) * frame.clientHeight));
                                            }
                                        }
                                    }
                                }
                            };
                    setTimeout(document.body.onscroll, 100);
                };
                if (globalState.config.disabledRenderingAnimation) {
                    globalState.activateOnScroll();
                }
            }
        }
    };
    var applyContent = function (html) {
        return makeDomNode({
            parent: document.body,
            tag: "div",
            className: "content",
            innerHTML: html,
        });
    };
    var applyFragmentId = function () {
        //  body.onload の時点ではコンテンツが間に合っておらず、 Web ブラウザによる通常のフラグメント識別子位置への
        //  スクロールは期待できない為、コンテンツの取得及びDOM生成完了後に明示的にスクロール位置の移動を行う。
        var fragmentId = decodeURI((location.href + "#").split("#")[1].trim());
        if (fragmentId) {
            location.href = "#" + fragmentId;
        }
    };
    var applyHighlight = function () {
        Array.from(document.querySelectorAll("code"))
            .forEach(function (element) {
            //  highlightjs が知らない言語が指定されてるとなにも実行されなくなるので指定を消すなり類似した言語に変換する
            switch (element.className) {
                case "lang-cmd":
                    element.className = "dos";
                    break;
            }
            return hljs.highlightBlock(element);
        });
    };
    var applyConditionalComment = function (source, condition, TAG) {
        return source
            .replace(new RegExp("<!--\\[" + TAG + "\\/\\]([\\s\\S]*?)-->", "g"), condition ? "$1" : "")
            .replace(new RegExp("<!--\\[" + TAG + "\\]-->([\\s\\S]*?)<!--\\[\\/" + TAG + "\\]-->", "g"), condition ? "$1" : "")
            .replace(new RegExp("<!--\\[NO" + TAG + "\\/\\]([\\s\\S]*?)-->", "g"), !condition ? "$1" : "")
            .replace(new RegExp("<!--\\[NO" + TAG + "\\]-->([\\s\\S]*?)<!--\\[\\/NO" + TAG + "\\]-->", "g"), !condition ? "$1" : "");
    };
    var unescapeBackSlash = function (source) {
        return skipEscape(source.split("\n"), function (line) {
            return line
                .replace(/\\</g, "&lt;")
                .replace(/\\>/g, "&gt;")
                .replace(/\\\\/g, "\\");
        }).join("\n");
    };
    var render = function (renderer, baseUrl, source) {
        return __awaiter(this, void 0, void 0, function () {
            var newUrl, currentUrlParamNames_1, referrerUrlParams, newUrl_1, urlArgs, isWriting, isMarked, isCommonMark, isMarkdownIt, isMarkdown, isRemark, isReveal, isEdit, message, applyMarkdown, marked, config, linkMaker_1, markedRenderer, commonmark_1, config, revealTheme, documentTheme, separator_1, separator_vertical_1, separator_notes_1, pasteMarkdown, revealTransition, forceTheme, config, defaultConfig, urlsDiv_1, textCounter_1, makeLink, defaultLink_1, markedLink_1, commonmarkLink_1, markdownitLink_1, remarkLink_1, revealLink_1, editLink_1, update, textarea_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        //  regulate return code
                        source = source.replace(/\r\n/g, "\n");
                        //  preload config
                        globalState.configBackup = deepCopy(globalState.config); // グローバルな設定のバックアップ
                        globalState.documentConfig = {};
                        loadConfig(source);
                        objectAssign(globalState.config, globalState.documentConfig);
                        //  この段階ではレンダラが確定しておらずディレクティブが機能していないがレンダラーに関する指定を取得する為に一度読み込む。後でリロードする。
                        if (globalState.config.referrer_option) {
                            console.log("referrer: " + document.referrer);
                            newUrl = location.href;
                            currentUrlParamNames_1 = (location.href.split("#")[0] + "?")
                                .split("?")[1]
                                .split("&")
                                .filter(function (i) { return 0 < i.indexOf("="); })
                                .map(function (i) { return i.substr(0, i.indexOf("=")); });
                            referrerUrlParams = (document.referrer.split("#")[0] + "?")
                                .split("?")[1]
                                .split("&")
                                .filter(function (i) { return 0 < i.indexOf("="); })
                                .filter(function (i) {
                                var name = i.substr(0, i.indexOf("="));
                                var result = true;
                                currentUrlParamNames_1.forEach(function (j) { if (j === name) {
                                    result = false;
                                } });
                                return result;
                            });
                            if (0 < referrerUrlParams.length) {
                                newUrl = newUrl.replace("?", "?" + referrerUrlParams.join("&") + "&");
                            }
                            if (!renderer) {
                                if ((document.referrer || "").split("?")[0] === location.href.split("?")[0]) {
                                    newUrl_1 = location.href;
                                    urlArgs = (document.referrer.split("#")[0] + "?")
                                        .split("?")[1]
                                        .split("&")
                                        .filter(function (i) { return i.indexOf("=") < 0; })
                                        .map(function (i) { return decodeURIComponent(i); });
                                    if (2 <= urlArgs.length) {
                                        renderer = urlArgs[0];
                                        newUrl_1 = newUrl_1.replace("?", "?" + renderer + "&");
                                    }
                                }
                            }
                            if (newUrl !== location.href) {
                                window.history.replaceState(null, document.title, newUrl);
                            }
                        }
                        renderer = renderer || (globalState.config.renderer || "markdown").toLowerCase();
                        console.log("🎨 renderer: " + (renderer || "null"));
                        isWriting = true;
                        isMarked = "marked" === renderer;
                        isCommonMark = "commonmark" === renderer;
                        isMarkdownIt = "markdown-it" === renderer;
                        isMarkdown = isMarked || isCommonMark || isMarkdownIt || "markdown" === renderer;
                        isRemark = "remark" === renderer;
                        isReveal = "reveal" === renderer;
                        isEdit = "edit" === renderer;
                        if (!isMarkdown && !isRemark && !isReveal && !isEdit) {
                            message = "Unknown Rederer Name: \"" + renderer + "\" ( Rederer Names: \"markdown\"(default), \"remark\", \"reveal\", \"edit\" )";
                            showError(message);
                            console.error(message);
                            return [2 /*return*/];
                        }
                        if (isMarkdown && !isMarked && !isCommonMark && !isMarkdownIt) {
                            isMarked = true; // とりあえずいまは marked を default の markdown のレンダラーとして扱う
                        }
                        //  conditional comment
                        if (!isEdit) {
                            source = applyConditionalComment(source, isWriting, "WRITING");
                            source = applyConditionalComment(source, isMarkdown, "MD");
                            source = applyConditionalComment(source, isMarked, "MARKED");
                            source = applyConditionalComment(source, isCommonMark, "COMMONMARK");
                            source = applyConditionalComment(source, isMarkdownIt, "MARKDOWN-IT");
                            source = applyConditionalComment(source, isRemark, "REMARK");
                            source = applyConditionalComment(source, isReveal, "REVEAL");
                        }
                        //  reload config
                        globalState.config = globalState.configBackup; // ディレクティブが効いてない状態で読み込んだ設定をクリア
                        globalState.documentConfig = {}; // ディレクティブが効いてない状態で読み込んだ設定をクリア
                        source = loadConfig(source);
                        console.log("⚙️ WRTING-CONFING: " + JSON.stringify(globalState.documentConfig, null, 4));
                        objectAssign(globalState.config, globalState.documentConfig);
                        //  レンダラー別の設定の適用
                        objectAssign(globalState.config, isMarkdown && globalState.config.markdown);
                        objectAssign(globalState.config, isMarked && globalState.config.marked);
                        objectAssign(globalState.config, isCommonMark && globalState.config.commonmark);
                        objectAssign(globalState.config, isMarkdownIt && globalState.config.markdownit);
                        objectAssign(globalState.config, isRemark && globalState.config.remark);
                        objectAssign(globalState.config, isReveal && globalState.config.reveal);
                        console.log("⚙️ finally config: " + JSON.stringify(globalState.config, null, 4));
                        //  title
                        applyTitle(source);
                        //  favicon
                        applyIcon(baseUrl);
                        applyMarkdown = function (markdownToHtml) {
                            return __awaiter(this, void 0, void 0, function () {
                                var contentDiv, isSolidavailableDocument;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            document.body.classList.add("markdown");
                                            //  theme
                                            appendHighlightTheme();
                                            applyTheme(baseUrl);
                                            //  style
                                            source = applyStyle(source);
                                            return [4 /*yield*/, applyMermaid(source)];
                                        case 1:
                                            // mermaid
                                            source = _c.sent();
                                            //  wallpaper
                                            applyWallPaper(baseUrl);
                                            source = translateRelativeLink(baseUrl, source);
                                            source = unescapeBackSlash(source);
                                            source = translateForMathJax(source);
                                            applyContent(markdownToHtml(source));
                                            contentDiv = document.getElementsByClassName("content")[0];
                                            isSolidavailableDocument = 0 < contentDiv.children.length &&
                                                "h1" === contentDiv.firstChild.nodeName.toLowerCase() &&
                                                1 === contentDiv.firstChild.childNodes.length &&
                                                Node.TEXT_NODE === contentDiv.firstChild.firstChild.nodeType;
                                            if (((undefined === globalState.config.solid || null === globalState.config.solid) && isSolidavailableDocument) || globalState.config.solid) {
                                                document.body.classList.add("solid");
                                            }
                                            //  highlight
                                            return [4 /*yield*/, tryOrThroughAsync("highlight", loadHighlightScript)];
                                        case 2:
                                            //  highlight
                                            _c.sent();
                                            //  MathJax
                                            return [4 /*yield*/, tryOrThroughAsync("MathJax", loadMathJaxScript)];
                                        case 3:
                                            //  MathJax
                                            _c.sent();
                                            //  twitter
                                            return [4 /*yield*/, tryOrThroughAsync("twitter", loadTwitterScript)];
                                        case 4:
                                            //  twitter
                                            _c.sent();
                                            //  index
                                            applyIndex(source);
                                            //  fragment id
                                            if (globalState.config.disabledRenderingAnimation) {
                                                applyFragmentId();
                                            }
                                            return [4 /*yield*/, hideRendering()];
                                        case 5:
                                            _c.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        };
                        if (!isMarked) return [3 /*break*/, 2];
                        return [4 /*yield*/, loadModule("@js/marked.js")];
                    case 1:
                        marked = _c.sent();
                        config = { gfm: true, tables: true };
                        try {
                            config = JSON.parse((source + "<!--[MARKED-CONFIG] { \"gfm\": true, \"tables\": true } -->").split("<!--[MARKED-CONFIG]")[1].split("-->")[0].trim());
                        }
                        catch (e) {
                            console.error(new Error().stack);
                            console.error(JSON.stringify(e));
                        }
                        console.log("marked-config: " + JSON.stringify(config, null, 4));
                        linkMaker_1 = new MarkdownHeaderFragmentMaker();
                        markedRenderer = new marked.Renderer();
                        markedRenderer.heading = function (text, level, raw) {
                            return '<h'
                                + level
                                + ' id="'
                                + this.options.headerPrefix
                                + linkMaker_1.makeFragment(raw)
                                //+ raw.toLowerCase().replace(/[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/g,"").replace(/ /g,"-")
                                + '">'
                                + text.replace(explicitFragmentIdPattern, "")
                                + '</h'
                                + level
                                + '>\n';
                        };
                        config.renderer = markedRenderer;
                        marked.setOptions(config);
                        applyMarkdown(marked);
                        _c.label = 2;
                    case 2:
                        if (!isCommonMark) return [3 /*break*/, 4];
                        return [4 /*yield*/, loadModule("@js/commonmark.js")];
                    case 3:
                        commonmark_1 = _c.sent();
                        applyMarkdown(function (markdown) {
                            return new commonmark_1.HtmlRenderer().render(new commonmark_1.Parser().parse(markdown));
                        });
                        _c.label = 4;
                    case 4:
                        if (!isMarkdownIt) return [3 /*break*/, 9];
                        //  markdown-it
                        return [4 /*yield*/, loadModule("@js/markdown-it.js", ["markdown-it"])];
                    case 5:
                        //  markdown-it
                        _c.sent();
                        return [4 /*yield*/, loadModule("@js/markdown-it-emoji.js", ["markdown-it-emoji"])];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, loadModule("@js/markdown-it-plantuml/lib/deflate.js", ["./lib/deflate.js"])];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, loadModule("@js/markdown-it-plantuml/index.js", ["markdown-it-plantuml"])];
                    case 8:
                        _c.sent();
                        applyMarkdown(function (markdown) {
                            return window.require("markdown-it")({ html: true, })
                                .use(window.require("markdown-it-emoji"))
                                .use(window.require("markdown-it-plantuml"))
                                .render(markdown);
                        });
                        _c.label = 9;
                    case 9:
                        if (!isRemark) return [3 /*break*/, 15];
                        //  theme
                        applyTheme(baseUrl);
                        //  style
                        source = applyStyle(source);
                        source = skipEscape(source.split("\n"), function (line) {
                            if (">>>" === line) {
                                line = "---";
                            }
                            return line;
                        }).join("\n");
                        return [4 /*yield*/, applyMermaid(source)];
                    case 10:
                        // mermaid
                        source = _c.sent();
                        //  remark
                        return [4 /*yield*/, loadScript(makeSystemUrl("@js/remark-latest.min.js"))];
                    case 11:
                        //  remark
                        _c.sent();
                        config = JSON.parse((source + "<!--[REMARK-CONFIG] { } -->").split("<!--[REMARK-CONFIG]")[1].split("-->")[0].trim());
                        source = skipEscapeBlock(source, function (block) {
                            return block.replace(/<!--\[REMARK-CONFIG\][\S\s]*?-->/, "");
                        });
                        config.source = translateForMathJax(translateRelativeLink(baseUrl, translateLinkWithinPageForRemark(translateForSlide(source)))
                            .replace(/([^\n])```([^\n])/g, "$1`$2"));
                        remark.create(config);
                        //  MathJax
                        return [4 /*yield*/, tryOrThroughAsync("MathJax", loadMathJaxScript)];
                    case 12:
                        //  MathJax
                        _c.sent();
                        //  twitter
                        return [4 /*yield*/, tryOrThroughAsync("twitter", loadTwitterScript)];
                    case 13:
                        //  twitter
                        _c.sent();
                        return [4 /*yield*/, hideRendering()];
                    case 14:
                        _c.sent();
                        _c.label = 15;
                    case 15:
                        if (!isReveal) return [3 /*break*/, 23];
                        //  reveal
                        appendTheme("css/reveal.css");
                        revealTheme = /<!--\[REVEAL-THEME\]\s*(.*?)\s*-->/.exec(source + "<!--[REVEAL-THEME]league-->")[1].toLowerCase();
                        console.log("reveal-theme: " + revealTheme);
                        appendTheme("css/theme/" + revealTheme + ".css", "theme");
                        documentTheme = document.getElementById("theme");
                        appendTheme("lib/css/zenburn.css");
                        appendTheme(window.location.search.match(/print-pdf/gi) ? 'css/print/pdf.css' : 'css/print/paper.css');
                        //  theme
                        applyTheme(baseUrl);
                        //  style
                        source = applyStyle(source);
                        return [4 /*yield*/, applyMermaid(source)];
                    case 16:
                        // mermaid
                        source = _c.sent();
                        makeDomNode({
                            parent: document.head,
                            tag: "style",
                            innerHTML: (source + "<!--[STYLE] -->").split("<!--[STYLE]")[1].split("-->")[0].trim(),
                        });
                        separator_1 = (source + "<!--[REVEAL-SEPARATOR] ^\\n---$ -->").split("<!--[REVEAL-SEPARATOR]")[1].split("-->")[0].trim();
                        separator_vertical_1 = (source + "<!--[REVEAL-SEPARATOR-VERTICAL] ^\\n>>>$ -->").split("<!--[REVEAL-SEPARATOR-VERTICAL]")[1].split("-->")[0].trim();
                        separator_notes_1 = (source + "<!--[REVEAL-SEPARATOR-NOTES] ^Note: -->").split("<!--[REVEAL-SEPARATOR-NOTES]")[1].split("-->")[0].trim();
                        pasteMarkdown = function (markdown) {
                            return makeDomNode({
                                parent: document.body,
                                tag: "div",
                                className: "reveal",
                                children: {
                                    tag: "div",
                                    className: "slides",
                                    children: {
                                        tag: "section",
                                        attributes: {
                                            "data-markdown": "",
                                            "data-separator": separator_1,
                                            "data-separator-vertical": separator_vertical_1,
                                            "data-separator-notes": separator_notes_1,
                                        },
                                        children: {
                                            tag: "script",
                                            type: "text/template",
                                            innerHTML: translateForMathJax(markdown),
                                        },
                                    },
                                },
                            });
                        };
                        pasteMarkdown(translateRelativeLink(baseUrl, translateLinkWithinPageForReveal(translateForSlide(source))));
                        return [4 /*yield*/, loadScript(makeSystemUrl("@lib/js/head.min.js"))];
                    case 17:
                        _c.sent();
                        return [4 /*yield*/, loadModule("@plugin/markdown/marked.js", ["./marked"])];
                    case 18:
                        _c.sent();
                        return [4 /*yield*/, loadModule("//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js")];
                    case 19:
                        hljs = _c.sent();
                        return [4 /*yield*/, loadModule("@js/reveal.js")];
                    case 20:
                        Reveal = _c.sent();
                        window.module.pauseCapture();
                        revealTransition = /<!--\[REVEAL-TRANSITION\]\s*(.*?)\s*-->/.exec(source + "<!--[REVEAL-TRANSITION]concave-->")[1].toLowerCase();
                        console.log("reveal-transition: " + revealTransition);
                        console.log("reveal-theme(forced by url param): " + Reveal.getQueryHash().theme);
                        console.log("reveal-transition(forced by url param): " + Reveal.getQueryHash().transition);
                        forceTheme = Reveal.getQueryHash().theme;
                        if (forceTheme) {
                            documentTheme.href = "css/theme/" + forceTheme + ".css";
                        }
                        config = JSON.parse((source + "<!--[REVEAL-CONFIG] { } -->").split("<!--[REVEAL-CONFIG]")[1].split("-->")[0].trim());
                        console.log("reveal-config: " + JSON.stringify(config, null, 4));
                        defaultConfig = {
                            controls: true,
                            progress: true,
                            history: true,
                            center: true,
                            transition: Reveal.getQueryHash().transition || revealTransition,
                            math: {
                                mathjax: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js',
                                config: 'TeX-AMS_HTML-full'
                            },
                            dependencies: [
                                { src: 'lib/js/classList.js', condition: function () { return !document.body.classList; } },
                                { src: 'plugin/markdown/marked.js', condition: function () { return !!document.querySelector('[data-markdown]'); } },
                                { src: 'plugin/markdown/markdown.js', condition: function () { return !!document.querySelector('[data-markdown]'); } },
                                { src: 'plugin/highlight/highlight.js', async: true, callback: function () {
                                        hljs.initHighlightingOnLoad();
                                        applyHighlight();
                                    } },
                                { src: 'plugin/search/search.js', async: true },
                                { src: 'plugin/zoom-js/zoom.js', async: true },
                                { src: 'plugin/notes/notes.js', async: true },
                                { src: 'plugin/math/math.js', async: true }
                            ]
                        };
                        Reveal.initialize(objectAssign(defaultConfig, config));
                        return [4 /*yield*/, tryOrThroughAsync("twitter", loadTwitterScript)];
                    case 21:
                        _c.sent();
                        return [4 /*yield*/, hideRendering()];
                    case 22:
                        _c.sent();
                        _c.label = 23;
                    case 23:
                        if (!isEdit) return [3 /*break*/, 25];
                        //  edit
                        recursiveAssign(document.body.style, {
                            margin: "0",
                            overflow: "hidden",
                            backgroundColor: "#86812A",
                        });
                        urlsDiv_1 = makeDomNode({
                            parent: document.body,
                            tag: "div",
                            style: {
                                padding: "0.5rem 1.0rem",
                                width: "100%",
                                height: "1rem",
                                verticalAlign: "middle",
                                lineHeight: "1rem",
                            },
                        });
                        textCounter_1 = makeDomNode({
                            parent: urlsDiv_1,
                            tag: "span",
                            style: {
                                color: "#CCCCCC",
                                padding: "0rem 1.0rem",
                            }
                        });
                        makeLink = function (text) {
                            return makeDomNode({
                                parent: urlsDiv_1,
                                tag: "a",
                                style: {
                                    color: "#FFFFFF",
                                    padding: "0rem 1.0rem",
                                },
                                text: text,
                                target: "_blank",
                            });
                        };
                        defaultLink_1 = makeLink("default");
                        markedLink_1 = makeLink("marked(markdown)");
                        commonmarkLink_1 = makeLink("commonmark(markdown)");
                        markdownitLink_1 = makeLink("markdown-it(markdown)");
                        remarkLink_1 = makeLink("remark(slide)");
                        revealLink_1 = makeLink("reveal(slide)");
                        editLink_1 = makeLink("edit");
                        update = function () {
                            var text = encodeURIComponent(textarea_1.value);
                            textCounter_1.innerText = "lenght:" + text.length;
                            defaultLink_1.href = "?text:" + text;
                            markedLink_1.href = "?marked&text:" + text;
                            commonmarkLink_1.href = "?commonmark&text:" + text;
                            markdownitLink_1.href = "?markdown-it&text:" + text;
                            remarkLink_1.href = "?remark&text:" + text;
                            revealLink_1.href = "?reveal&text:" + text;
                            editLink_1.href = "?edit&text:" + text;
                        };
                        textarea_1 = makeDomNode({
                            parent: document.body,
                            tag: "textarea",
                            style: {
                                width: "100%",
                                height: "100%",
                                margin: "0rem 1rem 1rem 1rem",
                            },
                            value: source,
                            eventListener: {
                                change: update,
                                keyup: update,
                            },
                        });
                        recursiveAssign(textarea_1.style, {
                            width: "calc(100vw - 2rem)",
                            height: "calc(100vh - 3rem)",
                        });
                        update();
                        return [4 /*yield*/, hideRendering()];
                    case 24:
                        _c.sent();
                        _c.label = 25;
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    var loadGoogleAnalytics = function () {
        if (globalState && globalState.config && globalState.config.googleAnalyticsTracckingId) {
            loadScript("https://www.googletagmanager.com/gtag/js?" + globalState.config.googleAnalyticsTracckingId);
            window["dataLayer"] = window["dataLayer"] || [];
            var gtag = function (_a, _b) {
                window["dataLayer"].push(arguments);
            };
            gtag("js", new Date());
            gtag("config", globalState.config.googleAnalyticsTracckingId);
        }
    };
    var parseUrlParameters = function (url) {
        var urlParameters = {
            "renderer": null,
            "sourceUrl": null,
        };
        var basicUrlArgs = (url.split("#")[0] + "?")
            .split("?")[1]
            .split("&")
            .filter(function (i) { return 0 < i.length; })
            .filter(function (i) { return i.indexOf("=") < 0; })
            .map(function (i) { return decodeURIComponent(i); });
        if (1 <= basicUrlArgs.length) {
            if (2 <= basicUrlArgs.length) {
                urlParameters.renderer = basicUrlArgs[0];
                urlParameters.sourceUrl = basicUrlArgs[1];
            }
            else {
                urlParameters.sourceUrl = basicUrlArgs[0];
            }
        }
        return urlParameters;
    };
    var loadUrlParameters = function () {
        globalState.urlParameters = parseUrlParameters(location.href);
        console.log("⚙️ urlParameters: " + JSON.stringify(globalState.urlParameters, null, 4));
        if (!globalState.urlParameters.sourceUrl) {
            globalState.urlParameters.sourceUrl = globalState.config.defaultDocument || "index.md";
        }
        globalState.urlParameters.sourceUrl = globalState.urlParameters.sourceUrl
            .replace(/^(?:https\:)?\/\/github\.com\/([^/]+\/[^/]+)\/blob\/(.*\.md)(#.*)?$/, "https://raw.githubusercontent.com/$1/$2");
        globalState.documentBaseUrl = "text:" === globalState.urlParameters.sourceUrl.slice(0, 5) ?
            globalState.urlParameters.sourceUrl :
            makeAbsoluteUrl(globalState.config.baseUrl, globalState.urlParameters.sourceUrl);
    };
    var loadDocument = function (sourceUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_c) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var request_1;
                        return __generator(this, function (_c) {
                            if ("text:" === sourceUrl.slice(0, 5)) {
                                //render(globalState.urlParameters.renderer, location.href, globalState.urlParameters.sourceUrl.slice(5));
                                resolve(sourceUrl.slice(5));
                            }
                            else {
                                console.log("📥 loading document: " + sourceUrl);
                                request_1 = new XMLHttpRequest();
                                request_1.open('GET', sourceUrl, true);
                                request_1.onreadystatechange = function () {
                                    if (4 === request_1.readyState) {
                                        if (200 <= request_1.status && request_1.status < 300) {
                                            //render(globalState.urlParameters.renderer, makeAbsoluteUrl(location.href, globalState.urlParameters.sourceUrl), );
                                            resolve(request_1.responseText);
                                        }
                                        else {
                                            showLoadingError(sourceUrl, request_1);
                                            reject();
                                        }
                                    }
                                };
                                request_1.send(null);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    var loadJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_c) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var jsonScripts, loadCount;
                        return __generator(this, function (_c) {
                            jsonScripts = Array.from(document.getElementsByTagName('script'))
                                .filter(function (script) { return "application/json" === script.type; });
                            loadCount = 0;
                            jsonScripts.forEach(function (script) {
                                var name = script.getAttribute("data-let");
                                var sourceUrl = script.src;
                                console.log("📥 loading json(" + name + "): " + sourceUrl);
                                var request = new XMLHttpRequest();
                                request.open('GET', sourceUrl, true);
                                request.onreadystatechange = function () {
                                    if (4 === request.readyState) {
                                        if (200 <= request.status && request.status < 300) {
                                            try {
                                                objectAssign(globalState[name], JSON.parse(request.responseText));
                                                console.log("⚙️ load JSON(" + name + ") from " + sourceUrl + " : " + request.responseText);
                                            }
                                            catch (err) {
                                                console.error(err);
                                                console.error("error JSON(" + sourceUrl + "): " + request.responseText);
                                            }
                                            if (jsonScripts.length <= ++loadCount) {
                                                resolve();
                                            }
                                        }
                                        else {
                                            showLoadingError(sourceUrl, request);
                                        }
                                    }
                                };
                                request.send(null);
                            });
                            if (jsonScripts.length <= 0) {
                                resolve();
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    var isHtml = function (source) { return /[^`]\<\/html\>($|[^`])/.test(skipEscapeBlock(source.replace(/<!--.*?-->/g, ""), undefined, function (_block) { return undefined; })
        .replace(/\s/g, "")
        .toLowerCase()); };
    var startup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var source, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, loadJson()];
                    case 1:
                        _c.sent();
                        globalState.config.baseUrl = "@" + (globalState.config.baseUrl || ".");
                        if ("/" !== globalState.config.baseUrl.substr(-1)) {
                            globalState.config.baseUrl += "/";
                        }
                        globalState.config.baseUrl = makeAbsoluteUrl(location.href, globalState.config.baseUrl);
                        globalState.systemRootUrl = makeAbsoluteUrl(location.href, "@dummy").replace(/dummy$/, "");
                        console.log("globalState.systemRootUrl: " + globalState.systemRootUrl);
                        loadUrlParameters();
                        if (!("@system-loading-error" === globalState.urlParameters.sourceUrl.toLowerCase())) return [3 /*break*/, 2];
                        return [3 /*break*/, 11];
                    case 2:
                        if (!("@loading" === globalState.urlParameters.sourceUrl.toLowerCase())) return [3 /*break*/, 3];
                        hideSystemLoadingError();
                        return [3 /*break*/, 11];
                    case 3:
                        if (!("@rendering" === globalState.urlParameters.sourceUrl.toLowerCase())) return [3 /*break*/, 4];
                        hideSystemLoadingError();
                        hideLoading();
                        return [3 /*break*/, 11];
                    case 4:
                        if (!("@rendering-error" === globalState.urlParameters.sourceUrl.toLowerCase())) return [3 /*break*/, 5];
                        showRenderingError();
                        return [3 /*break*/, 11];
                    case 5:
                        hideSystemLoadingError();
                        return [4 /*yield*/, loadDocument(globalState.documentBaseUrl)];
                    case 6:
                        source = _c.sent();
                        if (!isHtml(source)) return [3 /*break*/, 7];
                        location.href = globalState.documentBaseUrl + "#" + location.hash;
                        return [3 /*break*/, 11];
                    case 7:
                        hideLoading();
                        tryOrThrough("GoogleAnalytics", loadGoogleAnalytics);
                        _c.label = 8;
                    case 8:
                        _c.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, render(globalState.urlParameters.renderer, globalState.documentBaseUrl, source)];
                    case 9:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        err_2 = _c.sent();
                        showRenderingError();
                        console.error("\uD83D\uDEAB " + err_2);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    startup();
})();
//# sourceMappingURL=writing.js.map