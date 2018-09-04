'use strict';
//  The license of this file is Boost Software License, Version 1.0. ( Http://www.boost.org/LICENSE_1_0.txt ).
//  このファイルのライセンスは Boost Software License, Version 1.0. ( http://www.boost.org/LICENSE_1_0.txt ) とします。

declare const hljs: any;
declare const marked: any;
declare const remark: any;
declare const commonmark: any;
declare const Reveal: any;

interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}
declare interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}

(function()
{
    const globalState : any =
    {
        "config": { }
    };
    const explicitFragmentIdPattern = /\{\#(.*?)\}$/;

    const timeout = async function(wait : number) : Promise<void>
    {
        return new Promise<void>(resolve => setTimeout(resolve, wait));
    };
    const tryOrThrough = function(title : string, f : () => void) : void
    {
        try
        {
            f();
        }
        catch(err)
        {
            console.error(`🚫 ${title}: ${err}`);
        }
    };
    const tryOrThroughAsync = async function(title : string, f : () => Promise<void>) : Promise<void>
    {
        try
        {
            await f();
        }
        catch(err)
        {
            console.error(`🚫 ${title}: ${err}`);
        }
    };
    const objectAssign = function(target : object, source : object) : object
    {
        //  copy from https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
        if (typeof Object.assign !== 'function') {
            (function () {
                Object.assign = function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                const output = Object(target);
                for (let index = 1; index < arguments.length; index++) {
                    const source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (const nextKey in source) {
                            if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                                output[nextKey] = source[nextKey];
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
    const deepCopy = function(source : object) : object
    {
        return JSON.parse(JSON.stringify(source));
    };
    const recursiveAssign = function(target : object, source : object) : void
    {
        for(const key in source)
        {
            if (source.hasOwnProperty(key))
            {
                const value = source[key];
                if ("object" === practicalTypeof(value))
                {
                    if (undefined === target[key])
                    {
                        target[key] = { };
                    }
                    recursiveAssign(target[key], value);
                }
                else
                {
                    target[key] = value;
                }
            }
        }
    };
    const practicalTypeof = function(obj : any) : string
    {
        if (undefined === obj)
        {
            return "undefined";
        }
        if (null === obj)
        {
            return "null";
        }
        if ("[object Array]" === Object.prototype.toString.call(obj))
        {
            return "array";
        }

        return typeof obj;
    };
    const makeDomNode = function(arg : any) : Node
    {
        if (arg instanceof Node)
        {
            return arg;
        }
        if ("string" === practicalTypeof(arg))
        {
            return document.createTextNode(arg);
        }
        return setToElement(document.createElement(arg.tag), arg);
    };
    const setToElement = function(element : Element, arg : any) : Node
    {
        for(const key in arg)
        {
            if (arg.hasOwnProperty(key))
            {
                switch(key)
                {
                case "tag":
                case "parent":
                case "children":
                case "attributes":
                case "eventListener":
                    //  nop
                    break;
                default:
                    const value = arg[key];
                    if (undefined !== value)
                    {
                        if ("object" === practicalTypeof(value))
                        {
                            recursiveAssign(element[key], value);
                        }
                        else
                        {
                            element[key] = value;
                        }
                    }
                    break;
                }
            }
        }
        if (undefined !== arg.attributes)
        {
            for(const key in arg.attributes)
            {
                if (arg.attributes.hasOwnProperty(key))
                {
                    element.setAttribute(key, arg.attributes[key]);
                    //  memo: value を持たない attribute を設定したい場合には value として "" を指定すれば良い。
                }
            }
        }
        if (undefined !== arg.children)
        {
            if ("array" === practicalTypeof(arg.children))
            {
                arg.children.forEach
                (
                    function(i)
                    {
                        element.appendChild(makeDomNode(i));
                    }
                );
            }
            else
            {
                element.appendChild(makeDomNode(arg.children));
            }
        }
        if (undefined !== arg.eventListener)
        {
            for(const key in arg.eventListener)
            {
                if (arg.eventListener.hasOwnProperty(key))
                {
                    element.addEventListener(key, arg.eventListener[key]);
                }
            }
       }
        if (undefined !== arg.parent)
        {
            arg.parent.appendChild(element);
        }
        return element;
    };
    const hideSystemLoadingError = function () : void
    {
        document.body.classList.remove("writing-HTML-system-loading-error");
        document.body.classList.add("writing-HTML-document-loading");
        console.log("✅ system loading succeeded.");
    };
    const hideLoading = function () : void
    {
        document.body.classList.remove("writing-HTML-document-loading");
        document.body.classList.add("writing-HTML-document-rendering");
    };
    const hideRendering = async function (withError : boolean = false) : Promise<void>
    {
        hideLoading();
        if (globalState.config.disabledRenderingAnimation)
        {
            document.body.classList.remove("writing-HTML-document-rendering");
        }
        else
        {
            document.body.classList.add("writing-HTML-document-rendering-slide-out");
            await timeout(290);
            document.body.classList.remove("writing-HTML-document-rendering");
            document.body.classList.remove("writing-HTML-document-rendering-slide-out");
            await timeout(100);
            applyFragmentId();
            if (globalState.activateOnScroll)
            {
                globalState.activateOnScroll();
            }
        }
        if (!withError)
        {
            console.log("✅ document rendering succeeded.");
        }
    };
    const showRenderingError = function () : void
    {
        document.body.classList.add("writing-HTML-document-rendering-error");
        
        //  画面をクリックしたら復元(エラーがあってもとにかく表示された方が嬉しい場面もあるので)
        document.getElementById("writing-HTML-document-rendering-error-panel").onclick = async function()
        {
            document.body.classList.remove("writing-HTML-document-rendering-error");
            await hideRendering();
        };
    };
    const showError = async function(arg) : Promise<void>
    {
        recursiveAssign
        (
            document.body.style,
            {
                margin: "0px",
            }
        );
        makeDomNode
        (
            {
                parent: document.body,
                tag: "div",
                style:
                {
                    color: "#AA3322",
                    backgroundColor: "#442211",
                    fontSize: "1.5rem",
                    padding: "0.4rem",
                    textAlign: "center",
                },
                children: arg,
            }
        );
        await hideRendering(true);
    };
    const showLoadingError = function(sourceUrl, request) : void
    {
        hideSystemLoadingError();
        showError
        (
            [
                "loading failed: { \"method\": \"GET\", \"url\": \"",
                {
                    tag: "a",
                    href: sourceUrl,
                    style:
                    {
                        color: "#6666FF",
                    },
                    children: sourceUrl,
                },
                "\", \"status\": "+ request.status + "};"
            ]
        );
        const responseDiv : any =
        {
            parent: document.body,
            tag: "div",
        };
        if (request.responseText)
        {
            responseDiv.innerHTML = request.responseText;
        }
        else
        {
            responseDiv.style =
            {
                whiteSpace: "pre-wrap",
                fontSize: "1.5rem",
                padding: "20px",
            };
            if (0 === request.status)
            {
                responseDiv.innerText = "There ia a possibility that server not found or it happened cross-domain issue.\nサーバーが見つからないかクロスドメインの問題が発生した可能性があります。";
            }
            else
            {
                responseDiv.innerText = JSON.stringify(request.getAllResponseHeaders(), null, 4);
            }
        }
        makeDomNode(responseDiv);
    };
    const appendLink = function(args : object) : void
    {
        makeDomNode
        (
            objectAssign
            (
                deepCopy(args),
                {
                    parent: document.head,
                    tag: "link"
                }
            )
        );
    };
    const appendTheme = function(href : string, id : string = undefined) : void
    {
        appendLink
        (
            {
                rel: "stylesheet",
                type: "text/css",
                href: href,
                id: id
            }
        );
    };
    const appendHighlightTheme = function() : void
    {
        appendTheme("//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css");
    };
    const appendIcon = function(href : string) : void
    {
        appendLink
        (
            {
                rel: "shortcut icon",
                type: "image/x-icon",
                href: href,
            }
        );
        appendLink
        (
            {
                rel: "apple-touch-icon",
                type: undefined,
                href: href,
            }
        );
        (document.getElementById("twitter-card-image") as HTMLMetaElement).content = href;
    };
    const loadScript = async function(src : string) : Promise<void>
    {
        return new Promise<void>
        (
            (resolve, reject) => makeDomNode
            (
                {
                    parent: document.head,
                    tag: "script",
                    src: src,
                    onload: resolve,
                    onerror: reject,
                }
            )
        );
    };
    const loadHighlightScript = async function() : Promise<void>
    {
        await loadScript("//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js");
        hljs.initHighlightingOnLoad();
        applyHighlight();
    };
    const loadMathJaxScript = async function() : Promise<void>
    {
        await loadScript("//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML");
    };
    const loadTwitterScript = async function() : Promise<void>
    {
        await loadScript("//platform.twitter.com/widgets.js");
    };
    const makeAbsoluteUrl = function(base : string, url : string) : string
    {
        if ("#" === url.substr(0, 1))
        {
            return base.split("#")[0] +url;
        }
        let baseParts = base.split("?")[0].split("/");
        if (4 <= baseParts.length && "" !== baseParts[baseParts.length -1])
        {
            // ファイル名部分の除去
            baseParts = baseParts.slice(0, -1);
        }
        if (4 <= baseParts.length && "" === baseParts[baseParts.length -1])
        {
            // 末尾の空要素を除去(しておかないと結合時に余分に / が挟まる)
            baseParts = baseParts.slice(0, -1);
        }
        let urlParts = url.split("/");
        if (0 <= urlParts[0].indexOf(":"))
        {
            //  絶対パスなので base 側は全て破棄
            baseParts = [];
        }
        else
        {
            if ("" === urlParts[0])
            {
                urlParts = urlParts.slice(1);
                if ("" === urlParts[0])
                {
                    //  プロトコルだけ利用
                    baseParts = baseParts.slice(0, 1);
                }
                else
                {
                    //  サーバー名まで利用
                    baseParts = baseParts.slice(0, 3);
                }
            }
            else
            {
                while(true)
                {
                    if ("." === urlParts[0])
                    {
                        urlParts = urlParts.slice(1);
                        continue;
                    }
                    if (".." === urlParts[0])
                    {
                        urlParts = urlParts.slice(1);
                        if (4 <= baseParts.length)
                        {
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
    const makeRelativeUrl = function(url : string) : string
    {
        const base = location.href.split("#")[0];
        if ("#" === url.substr(0, 1))
        {
            return base.split("#")[0] +url;
        }
        if (location.href.split("#")[0] === url.split("#")[0])
        {
            return url;
        }
        let baseParts = base.split("?")[0].split("/");
        if (4 <= baseParts.length && "" !== baseParts[baseParts.length -1])
        {
            // ファイル名部分の除去
            baseParts = baseParts.slice(0, -1);
        }
        if (4 <= baseParts.length && "" === baseParts[baseParts.length -1])
        {
            // 末尾の空要素を除去(しておかないと結合時に余分に / が挟まる)
            baseParts = baseParts.slice(0, -1);
        }
        let urlParts = url.split("/");
        let matchLength = 0;
        while(0 < baseParts.length && 0 < urlParts.length && baseParts[matchLength] === urlParts[matchLength])
        {
            ++matchLength;
        }
        switch(matchLength)
        {
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
        let result = urlParts.join("/");
        if ("" === result)
        {
            result = ".";
        }
        return result;
    };
    const makeRebaseUrl = function(base : string, url : string) : string
    {
        if ("#" === url.substr(0, 1))
        {
            return url;
        }
        return makeRelativeUrl(makeAbsoluteUrl(base, url));
    };
    const skipEscape = function
    (
        lines : string[],
        map : (string, int) => string,
        escapeMap : (string, int) => string = undefined
    ) : string[]
    {
        let currentEscape = null;
        return lines.map
        (
            function(line, line_number)
            {
                const escape = "$$" === line.trim() ? "$$": line.trim().replace(/^(```+|~~~+).*/, "$1").replace(/^[`~]{0,2}(([^`~].*)|$)/,"");
                const isEscape = null === currentEscape && ("" !== escape) || (null !== currentEscape && currentEscape.substr(0,1) === escape.substr(0,1) && currentEscape.length <= escape.length);
                if (isEscape)
                {
                    if (null === currentEscape)
                    {
                        currentEscape = escape;
                    }
                    else
                    {
                        // ここでこういう処理を挟むのは行儀が悪いけど、閉じが長すぎる場合にここで整形してしまう。
                        line = currentEscape;

                        currentEscape = null;
                    }
                }
                if (null === currentEscape || isEscape)
                {
                    if (map)
                    {
                        line = map(line, line_number);
                    }
                }
                else
                {
                    if (escapeMap)
                    {
                        line = escapeMap(line, line_number);
                    }
                }
                return line;
            }
        );
    };
    const skipEscapeBlock = function
    (
        source : string,
        map : (string) => string,
        escapeMap : (string) => string = undefined,
        finish : () => void = undefined
    ) : string
    {
        const blocks = [];
        let current = [];
        let isInEscape = false;
        skipEscape
        (
            source.split("\n"),
            function(line)
            {
                if (isInEscape)
                {
                    const currentBlock = current.join("\n");
                    blocks.push
                    (
                        escapeMap ?
                            escapeMap(currentBlock):
                            currentBlock
                    );
                    isInEscape = false;
                    current = [];
                }
                current.push(line);
                return line;
            },
            function(line)
            {
                if (!isInEscape)
                {
                    const currentBlock = current.join("\n");
                    blocks.push
                    (
                        map ?
                            map(currentBlock):
                                currentBlock
                    );
                    isInEscape = true;
                    current = [];
                }
                current.push(line);
                return line;
            }
        );
        if (!isInEscape)
        {
            const currentBlock = current.join("\n");
            blocks.push
            (
                map ?
                map(currentBlock):
                    currentBlock
            );
        }
        else
        {
            //  ここにくるのは code escape が閉じてない時だけなので、基本的には到達してはいけない。
            const currentBlock = current.join("\n");
            blocks.push
            (
                escapeMap ?
                    escapeMap(currentBlock):
                    currentBlock
            );
        }
        if (undefined !== finish)
        {
            finish();
        }
        return blocks.join("\n");
    };
    const applyOption = function
    (
        source : string,
        TAG : string,
        applyer : (string) => void,
        finish : () => void = undefined
    ) : string
    {
        return skipEscapeBlock
        (
            source,
            function(block)
            {
                const reg = new RegExp("<!--\\[" +TAG +"\\]\\s*([\\s\\S]*?)\\s*-->", "gm");
                let matches = null;
                while (matches = reg.exec(block)) {
                    applyer(matches[1]);
                }
                return block.replace(reg, "");
            },
            undefined,
            finish
        );
    };
    const loadConfig = function(source : string) : string
    {
        return applyOption
        (
            source,
            "WRTING-CONFING",
            function(option)
            {
                try
                {
                    objectAssign
                    (
                        globalState.documentConfig,
                        JSON.parse(option)
                    );
                }
                catch(err)
                {
                    console.error(err);
                    console.error("error WRTING-CONFING: " +option);
                }
            }
        );
    };
    class MarkdownHeaderFragmentMaker
    {
        links : string[] = [];
        makeFragment(line : string) : string
        {
            const explicitFragmentIdMatch = line.match(explicitFragmentIdPattern);
            const link = explicitFragmentIdMatch ?
                explicitFragmentIdMatch[1]:
                line
                    .replace(/^#*/, "")
                    .replace(/!\[(.*?)\]\(.*?\)/g, "$1")
                    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
                    .replace(/(^|[^\\])<[^\>]*?[^\\]>/g, "$1") // エスケープを避けつつ適切に処理する為にはこの置換は2回行う必要がある。(3回は必要ない2回で十分)
                    .replace(/(^|[^\\])<[^\>]*?[^\\]>/g, "$1")
                    .trim()
                    .toLowerCase()
                    .replace(/[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/g,"")
                    .replace(/ /g,"-");
            let index = this.links[link];
            if (undefined === index)
            {
                this.links[link] = 0;
                return link;
            }
            else
            {
                ++index;
                this.links[link] = index;
                return link +"-" +index;
            }
        }
    }
    const getAllElements = function(parent : Element | Document = document) : Element[]
    {
        let result = [];
        if (parent.children)
        {
            Array.from(parent.children).forEach
            (
                i =>
                {
                    result.push(i);
                    result = result.concat(getAllElements(i));
                }
            );
        }
        return result;
    };
    const getHeadingTags = function() : Element[]
    {
        return getAllElements(document.body).filter(i =>  /^h\d+$/i.test(i.tagName));
    };
    class IndexItem
    {
        constructor
        (
            public level : number,
            public title : string,
            public link : string,
            public anchor : HTMLAnchorElement = null
        )
        {
        }
    }
    const makeIndexFromContent = function() : IndexItem[]
    {
        const linkMaker = new MarkdownHeaderFragmentMaker();
        const anchors : IndexItem[] = [];
        getHeadingTags().forEach
        (
            function(i)
            {
                const level = parseInt(i.tagName.substr(1), 10);
                const title = i.textContent.trim();
                if (!i.id)
                {
                    i.id = linkMaker.makeFragment(title);
                }
                const link = "#" +i.id;
                anchors.push
                (
                    new IndexItem
                    (
                        level,
                        title,
                        link
                    )
                );
            }
        );
        return anchors;
    };

    const translateRelativeUrl = function(baseUrl : string, url : string) : string
    {
        if ("?" === url.substr(0, 1))
        {
            return url +"&" +encodeURIComponent(makeRelativeUrl(baseUrl));
        }
        else
        if ("#" !== url.substr(0, 1))
        {
            const absoluteUrl = makeAbsoluteUrl(baseUrl, url);
            const relativeUrl = makeRelativeUrl(absoluteUrl);
            if (/.*\.md(\.txt)?(#.*)?$/i.test(absoluteUrl))
            {
                const thisPath = location.href.split("#")[0].split("?")[0];
                if (thisPath !== absoluteUrl.split("#")[0].split("?")[0])
                {
                    return "?" +encodeURIComponent(relativeUrl);
                }
            }
            else
            {
                return relativeUrl;
            }
        }
        return url;
    };
    const translateRelativeLink = function(baseUrl : string, source : string) : string
    {
        return skipEscape
        (
            source.split("\n"),
            function(line)
            {
                let isInInlineEscape = false;
                let isInSquareBracket = false;
                return line.split("`").map
                (
                    function(part)
                    {
                        if (!isInInlineEscape)
                        {
                            let match = null;

                            if (isInSquareBracket)
                            {
                                isInSquareBracket = false;
                                const re = /(.*?[^\\])?\]\((.*?[^\\])\)/g;
                                if (null !== (match = re.exec(part)))
                                {
                                    const label = undefined === match[1] ? "": match[1];
                                    const url = match[2];
                                    const traslatedUrl = translateRelativeUrl(baseUrl, url);
                                    if (url !== traslatedUrl)
                                    {
                                        part = part.replace(match[0], label +"](" +traslatedUrl +")");
                                    }
                                }
                            }

                            const re = /(^|[^\\])\[(.*?[^\\])?\]\((.*?[^\\])\)/g;
                            while(null !== (match = re.exec(part)))
                            {
                                const label = undefined === match[2] ? "": match[2];
                                const url = match[3];
                                const traslatedUrl = translateRelativeUrl(baseUrl, url);
                                if (url !== traslatedUrl)
                                {
                                    part = part.replace(match[0], match[1] +"[" +label +"](" +traslatedUrl +")");
                                }
                            }
                            if (/(^|[^\\])\]/.test(part))
                            {
                                isInSquareBracket = false;
                            }
                            if (/\[([^\]]|\\\])*$/.test(part))
                            {
                                isInSquareBracket = true;
                            }

                            const img_re = /\<(\s*)img(\s.*?)src=([\"\'])(.*?)([\"\'].*?)\>/g;
                            while(null !== (match = img_re.exec(part)))
                            {
                                const url = match[4];
                                const absoluteUrl = makeAbsoluteUrl(baseUrl, url);
                                const relativeUrl = makeRelativeUrl(absoluteUrl);
                                part = part.replace(match[0], "<" +match[1] +"img" +match[2] +"src=" +match[3] +relativeUrl +match[5] +">");
                            }
                        }
                        if ("\\" !== part.substring(-1))
                        {
                            isInInlineEscape = !isInInlineEscape;
                        }
                        return part;
                    }
                ).join("`");
            }
        ).join("\n");
    };
    const translateLinkWithinPageForRemark = function(source : string) : string
    {
        const lines = source.split("\n");
        const anchors = [ ];
        let page = 1;
        let isLayout = false;
        skipEscape
        (
            lines,
            function(line)
            {
                const trimed_line = line.trim();
                if ("--" === line || "---" === line)
                {
                    if (!isLayout)
                    {
                        ++page;
                    }
                    isLayout = false;
                }
                else
                if (/^#+ [^ ]+/.test(trimed_line))
                {
                    const anchor = trimed_line.replace(/^#*/, "").trim().toLowerCase().replace(/[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/g,"").replace(/ /g,"-");
                    anchors.push
                    (
                        {
                            anchor: "](#" +anchor +")",
                            page: "](#" +page +")"
                        }
                    );
                }
                else
                if ("layout:" === trimed_line.slice(0, 7) && "true" === trimed_line.slice(7).trim())
                {
                    isLayout = true;
                }
                return line;
            }
        );
        return skipEscape
        (
            lines,
            function(line)
            {
                anchors.forEach
                (
                    function(i)
                    {
                        line = line.split(i.anchor).join(i.page);
                    }
                );
                return line;
            }
        ).join("\n");
    };
    const translateLinkWithinPageForReveal = function(source : string) : string
    {
        const lines = source.split("\n");
        const anchors = [ ];
        let page = 0;
        skipEscape
        (
            lines,
            function(line)
            {
                const trimed_line = line.trim();
                if ("--" === line || "---" === line)
                {
                    ++page;
                }
                else
                if (/^#+ [^ ]+/.test(trimed_line))
                {
                    const anchor = trimed_line.replace(/^#*/, "").trim().toLowerCase().replace(/[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/g,"").replace(/ /g,"-");
                    anchors.push
                    (
                        {
                            anchor: "](#" +anchor +")",
                            page: "](#/" +page +")"
                        }
                    );
                }
                return line;
            }
        );
        return skipEscape
        (
            lines,
            function(line)
            {
                anchors.forEach
                (
                    function(i)
                    {
                        line = line.split(i.anchor).join(i.page);
                    }
                );
                return line;
            }
        ).join("\n");
    };
    const translateForSlide = function(source : string) : string
    {
        globalState.config.autoPageSeparate =
            undefined === globalState.config.autoPageSeparate ?
            "auto":
            globalState.config.autoPageSeparate;
        console.log("autoPageSeparate: " +globalState.config.autoPageSeparate);
        if
        (
            true === globalState.config.autoPageSeparate ||
            (
                false !== globalState.config.autoPageSeparate &&
                !/\n---\n/.test(source)
            )
        )
        {
            const lines = source.split("\n");
            let h1Count = 0;
            skipEscape
            (
                lines,
                function(line)
                {
                    const trimed_line = line.trim();
                    if (/^# [^ ]+/.test(trimed_line))
                    {
                        ++h1Count;
                    }
                    return line;
                }
            );

            let isFirst = true;
            const withJackUp = 1 < h1Count;
            return skipEscape
            (
                lines,
                function(line)
                {
                    const trimed_line = line.trim();
                    if (/^#+ [^ ]+/.test(trimed_line))
                    {
                        if (!isFirst)
                        {
                            if (withJackUp)
                            {
                                line = "#" +trimed_line;
                            }
                            line = "---\n" + line;
                        }
                        isFirst = false;
                    }
                    return line;
                }
            ).join("\n");
        }
        else
        {
            return source;
        }
    };
    const translateForMathJax = function(source : string) : string
    {
        return source.replace
        (
            /\n\$\$\n([\W\w]*?)\n\$\$\n/g,
            "\n<pre class=\"mathjax\">\n$$$$\n$1\n$$$$\n</pre>\n"
        );
    };
    const applyTitle = function(source : string) : void
    {
        if (undefined === globalState.config.title || "" === globalState.config.title)
        {
            const matches = /(^|\n)#\s+(.*)([\W\w]*)/.exec(source);
            if (matches)
            {
                globalState.config.title = matches[2];
            }

            if (undefined === globalState.config.title || "" === globalState.config.title)
            {
                const context =
                {
                    previousLine: undefined
                };
                skipEscape(source.split("\n"), function(line){
                    if (undefined === globalState.config.title || "" === globalState.config.title)
                    {
                        if (line.match(/^\=+$/) && (undefined !== context.previousLine && "" !== context.previousLine))
                        {
                            globalState.config.title = context.previousLine;
                        }
                        context.previousLine = line;
                    }
                    return line;
                });
            }

            if (undefined === globalState.config.title || "" === globalState.config.title)
            {
                globalState.config.title =
                (
                    source
                    .split("\n---\n")[0]
                    .replace(/([\W\w]*?)(\n?#+\s+)/, "$2")
                    .replace(/(^|\n)#+\s+(.*)([\W\w]*)/, "$2")
                    .replace(/<.*?>/g, "")
                    .split("\n")
                    .map(function(i){ return i.trim(); })
                    .filter(function(i) { return 0 < i.length; })[0]
                    || "untitled"
                )
                .replace(/\s+/g," ")
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
        (document.getElementById("twitter-card-title") as HTMLMetaElement).content = globalState.config.title;
    };
    const applyIcon = function(baseUrl : string) : void
    {
        appendIcon
        (
            globalState.config.favicon ?
                makeAbsoluteUrl(baseUrl, globalState.config.favicon):
                makeAbsoluteUrl(location.href, "writinghex.128.png")
        );
    };
    const applyTheme = function(baseUrl : string) : void
    {
        if (globalState.config.theme)
        {
            globalState.config.theme.forEach
            (
                function(i)
                {
                    appendTheme(makeRebaseUrl(baseUrl, i));
                }
            );
        }
        else
        {
            appendTheme("theme/default.css");
        }
    };
    const applyStyle = function(source : string) : string
    {
        return applyOption
        (
            source,
            "STYLE",
            function(option)
            {
                makeDomNode
                (
                    {
                        parent: document.head,
                        tag: "style",
                        innerHTML: option,
                    }
                );
            }
        );
    };
    const applyWallPaper = function(baseUrl : string) : void
    {
        if (globalState.config.wallpaper)
        {
            document.body.classList.add("with-wallpaper");
            makeDomNode
            (
                {
                    parent: document.body,
                    tag: "div",
                    className: "wallpaper",
                    style:
                    {
                        backgroundImage: "url(\"" +makeRebaseUrl(baseUrl, globalState.config.wallpaper) +"\")",
                    },
                }
            );
        }
    };
    const applyIndex = function(_source : string)
    {
        let index = null;
        const contentDiv = document.getElementsByClassName("content")[0];
        const isSmallDocument = contentDiv.clientHeight < document.body.clientHeight;
        if (((undefined === globalState.config.withIndex || null === globalState.config.withIndex) && !isSmallDocument) || globalState.config.withIndex)
        {
            index = makeIndexFromContent();
            if (index && 0 < index.length)
            {
                document.body.classList.add("with-index");
                document.body.insertBefore
                (
                    makeDomNode
                    (
                        {
                            tag: "div",
                            className: "index-frame",
                            children:
                            {
                                tag: "div",
                                className: "index",
                                onmouseenter: function() { globalState.isMouseOnIndex = true; },
                                onmouseleave: function() { globalState.isMouseOnIndex = false; },
                                children: index.map
                                (
                                    function(i)
                                    {
                                        return i.anchor = makeDomNode
                                        (
                                            {
                                                tag: "a",
                                                className: "level" + i.level,
                                                href: i.link,
                                                innerText: i.title,
                                            }
                                        ) as HTMLAnchorElement;
                                    }
                                )
                            }
                        }
                    ),
                    contentDiv
                );
                makeDomNode
                (
                    {
                        parent: contentDiv,
                        tag: "div",
                        style: { height: "90vh", },
                    }
                );

                //  index script
                applyIndexScript(index);
            }
            else
            {
                index = null;
            }
        }
        return index;
    };
    const applyIndexScript = function(index) : void
    {
        if (index)
        {
            index[0].anchor.classList.add("current");
            const previousState = { i: 0 }; // 本来は -1 で初期化するべきだが、それだと後ろの setTimeout(document.body.onscroll, 0); による初期表示が意図通りに機能しないので 0 にしてる。 
            const isOver = function(i)
            {
                return index.length <= i ||
                        (0 <= i && 32 < document.getElementById(index[i].link.substring(1)).getBoundingClientRect().top);
            };
            let previousContent = null;
            for(const i in index)
            {
                const content = document.getElementById(index[i].link.substring(1));
                if (!content)
                {
                    console.log("not found: " +index[i].link);
                    index[i].withError = true;
                }
                else
                if (previousContent && content.getBoundingClientRect().top < previousContent.getBoundingClientRect().top)
                {
                    console.log("may be duplicated id: " +index[i].link);
                    index[i].withError = true;
                }
                if (!index[i].withError)
                {
                    previousContent = content;
                }
            }
            index = index.filter(function(i) { return !i.withError; });

            if (0 < index.length)
            {
                globalState.activateOnScroll = function()
                {
                    document.body.onscroll =
                    document.documentElement.onscroll = // これは IE 用
                    function()
                    {
                        const previouseContetIsOver = isOver(previousState.i);
                        const nextContetIsOver = isOver(previousState.i +1);
                        if (previouseContetIsOver || !nextContetIsOver)
                        {
                            if (previouseContetIsOver)
                            {
                                //  上へ手繰る
                                while(isOver(--previousState.i)) { }
                            }
                            else
                            {
                                // 下へ手繰る
                                while(!isOver((++previousState.i) +1)) { }
                            }
                            const targetIndex = previousState.i < 0 ? null: index[previousState.i];
                            const current = document.getElementsByClassName("current")[0];
                            if (current !== (null === targetIndex ? null: targetIndex.anchor))
                            {
                                if (current)
                                {
                                    current.classList.remove("current");
                                }
                                if (targetIndex)
                                {
                                    targetIndex.anchor.classList.add("current");
                                    window.history.replaceState(null, targetIndex.title, targetIndex.link);
                                }
                                else
                                {
                                    index[0].anchor.classList.add("current");
                                    window.history.replaceState(null, document.title, "#");
                                }
                                if (!globalState.isMouseOnIndex)
                                {
                                    const frame = document.getElementsByClassName("index-frame")[0];
                                    if (null === targetIndex)
                                    {
                                        frame.scrollTop = 0;
                                    }
                                    else
                                    {
                                        const rect = targetIndex.anchor.getBoundingClientRect();
                                        const targetTop = rect.top +frame.scrollTop;
                                        frame.scrollTop = targetTop - Math.min(frame.clientHeight -rect.height, ((targetTop / frame.scrollHeight) *frame.clientHeight));
                                    }
                                }
                            }
                        }
                    };
                    setTimeout(document.body.onscroll, 100);
                };
                if (globalState.config.disabledRenderingAnimation)
                {
                    globalState.activateOnScroll();
                }
            }
        }
    };
    const applyContent = function(html : string) : HTMLDivElement
    {
        return makeDomNode
        (
            {
                parent: document.body,
                tag: "div",
                className: "content",
                innerHTML: html,
            }
        ) as HTMLDivElement;
    };
    const applyFragmentId = function() : void
    {
        //  body.onload の時点ではコンテンツが間に合っておらず、 Web ブラウザによる通常のフラグメント識別子位置への
        //  スクロールは期待できない為、コンテンツの取得及びDOM生成完了後に明示的にスクロール位置の移動を行う。
        const fragmentId = decodeURI((location.href +"#").split("#")[1].trim());
        if (fragmentId)
        {
            location.href = "#" +fragmentId;
        }
    };
    const applyHighlight = function() : void
    {
        Array.from(document.querySelectorAll("code"))
        .forEach
        (
            function(element)
            {
                //  highlightjs が知らない言語が指定されてるとなにも実行されなくなるので指定を消すなり類似した言語に変換する
                switch(element.className)
                {
                    case "lang-cmd":
                        element.className = "dos";
                        break;
                }

                return hljs.highlightBlock(element);
            }
        );
    };
    const applyConditionalComment = function(source : string, condition : boolean, TAG : string) : string
    {
        return source
            .replace(new RegExp("<!--\\[" +TAG +"\\/\\]([\\s\\S]*?)-->", "g"), condition ? "$1": "")
            .replace(new RegExp("<!--\\[" +TAG +"\\]-->([\\s\\S]*?)<!--\\[\\/" +TAG +"\\]-->", "g"), condition ? "$1": "")
            .replace(new RegExp("<!--\\[NO" +TAG +"\\/\\]([\\s\\S]*?)-->", "g"), !condition ? "$1": "")
            .replace(new RegExp("<!--\\[NO" +TAG +"\\]-->([\\s\\S]*?)<!--\\[\\/NO" +TAG +"\\]-->", "g"), !condition ? "$1": "");
    };
    const unescapeBackSlash = function(source) : string
    {
        return skipEscape
        (
            source.split("\n"),
            function(line)
            {
                return line
                    .replace(/\\</g, "&lt;")
                    .replace(/\\>/g, "&gt;")
                    .replace(/\\\\/g, "\\");
            }
        ).join("\n");
    };

    const render = async function(renderer : string, baseUrl : string, source : string) : Promise<void>
    {
        //  regulate return code
        source = source.replace(/\r\n/g,"\n");

        //  preload config
        globalState.configBackup = deepCopy(globalState.config); // グローバルな設定のバックアップ
        globalState.documentConfig = { };
        loadConfig(source);
        objectAssign
        (
            globalState.config,
            globalState.documentConfig
        );
        //  この段階ではレンダラが確定しておらずディレクティブが機能していないがレンダラーに関する指定を取得する為に一度読み込む。後でリロードする。

        if (globalState.config.referrer_option)
        {
            console.log("referrer: " +document.referrer);
            let newUrl = location.href;
            const currentUrlParamNames = (location.href.split("#")[0] +"?")
                .split("?")[1]
                .split("&")
                .filter(function(i) { return 0 < i.indexOf("="); })
                .map(function(i) { return i.substr(0, i.indexOf("=")); });
            const referrerUrlParams = (document.referrer.split("#")[0] +"?")
                .split("?")[1]
                .split("&")
                .filter(function(i) { return 0 < i.indexOf("="); })
                .filter
                (
                    function(i)
                    {
                        const name = i.substr(0, i.indexOf("="));
                        let result = true;
                        currentUrlParamNames.forEach(function(j) { if (j === name) { result = false; }});
                        return result;
                    }
                );
            if (0 < referrerUrlParams.length)
            {
                newUrl = newUrl.replace("?", "?" +referrerUrlParams.join("&") +"&");
            }
            if (!renderer)
            {
                if ((document.referrer || "").split("?")[0] === location.href.split("?")[0])
                {
                    let newUrl = location.href;
                    const urlArgs = (document.referrer.split("#")[0] +"?")
                        .split("?")[1]
                        .split("&")
                        .filter(function(i) { return i.indexOf("=") < 0; })
                        .map(function(i) { return decodeURIComponent(i);});
                    if (2 <= urlArgs.length)
                    {
                        renderer = urlArgs[0];
                        newUrl = newUrl.replace("?", "?" +renderer +"&");
                    }
                }
            }
            if (newUrl !== location.href)
            {
                window.history.replaceState(null, document.title, newUrl);
            }
        }
        renderer = renderer || (globalState.config.renderer || "markdown").toLowerCase();
        console.log("🎨 renderer: " +(renderer || "null"));
        const isWriting = true;
        let isMarked = "marked" === renderer;
        const isCommonMark = "commonmark" === renderer;
        const isMarkdownIt = "markdown-it" === renderer;
        const isMarkdown = isMarked || isCommonMark || isMarkdownIt || "markdown" === renderer;
        const isRemark = "remark" === renderer;
        const isReveal = "reveal" === renderer;
        const isEdit = "edit" === renderer;
        if (!isMarkdown && !isRemark && !isReveal && !isEdit)
        {
            const message = "Unknown Rederer Name: \"" +renderer +"\" ( Rederer Names: \"markdown\"(default), \"remark\", \"reveal\", \"edit\" )";
            showError(message);
            console.error(message);
            return;
        }
        if (isMarkdown && !isMarked && !isCommonMark && !isMarkdownIt)
        {
            isMarked = true; // とりあえずいまは marked を default の markdown のレンダラーとして扱う
        }

        //  conditional comment
        if (!isEdit)
        {
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
        globalState.documentConfig = { }; // ディレクティブが効いてない状態で読み込んだ設定をクリア
        source = loadConfig(source);
        console.log
        (
            "⚙️ WRTING-CONFING: " +JSON.stringify
            (
                globalState.documentConfig,
                null,
                4
            )
        );
        objectAssign
        (
            globalState.config,
            globalState.documentConfig
        );
        
        //  title
        applyTitle(source);

        //  favicon
        applyIcon(baseUrl);

        const applyMarkdown = async function(markdownToHtml : (string) => string) : Promise<void>
        {
            document.body.classList.add("markdown");

            //  theme
            appendHighlightTheme();
            applyTheme(baseUrl);

            //  style
            source = applyStyle(source);
            
            //  wallpaper
            applyWallPaper(baseUrl);
            
            source = translateRelativeLink(baseUrl, source);
            source = unescapeBackSlash(source);
            source = translateForMathJax(source);
            applyContent(markdownToHtml(source));

            const contentDiv = document.getElementsByClassName("content")[0];
            const isSolidavailableDocument =
                0 < contentDiv.children.length &&
                "h1" === contentDiv.firstChild.nodeName.toLowerCase() &&
                1 === contentDiv.firstChild.childNodes.length &&
                document.TEXT_NODE === contentDiv.firstChild.firstChild.nodeType;
            if (((undefined === globalState.config.solid || null === globalState.config.solid) && isSolidavailableDocument) || globalState.config.solid)
            {
                document.body.classList.add("solid");
            }

            //  highlight
            await tryOrThroughAsync("highlight", loadHighlightScript);

            //  MathJax
            await tryOrThroughAsync("MathJax", loadMathJaxScript);

            //  twitter
            await tryOrThroughAsync("twitter", loadTwitterScript);

            //  index
            applyIndex(source);

            //  fragment id
            if (globalState.config.disabledRenderingAnimation)
            {
                applyFragmentId();
            }

            await hideRendering();
        };

        if (isMarked)
        {
            //  marked
            await loadScript("js/marked.js");
            let config : any = { gfm: true, tables: true };
            try
            {
                config = JSON.parse((source+"<!--[MARKED-CONFIG] { \"gfm\": true, \"tables\": true } -->").split("<!--[MARKED-CONFIG]")[1].split("-->")[0].trim());
            }
            catch(e)
            {
                console.error(new Error().stack);
                console.error(JSON.stringify(e));
            }
            console.log("marked-config: " +JSON.stringify(config, null, 4));
            const linkMaker = new MarkdownHeaderFragmentMaker();
            const markedRenderer = new marked.Renderer();
            markedRenderer.heading = function (text, level, raw)
            {
                return '<h'
                + level
                + ' id="'
                + this.options.headerPrefix
                + linkMaker.makeFragment(raw)
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
        }
        if (isCommonMark)
        {
            //  commonmark
            await loadScript("js/commonmark.js");
            applyMarkdown
            (
                function(markdown)
                {
                    return new commonmark.HtmlRenderer().render
                    (
                        new commonmark.Parser().parse
                        (
                            markdown
                        )
                    );
                }
            );
        }
        if (isMarkdownIt)
        {
            //  markdown-it
            await loadScript("js/markdown-it.js");
            await loadScript("js/markdown-it-emoji.js");
            applyMarkdown
            (
                function(markdown)
                {
                    const markdownitWindow : any = window;
                    return markdownitWindow.markdownit({ html: true, }).use(markdownitWindow.markdownitEmoji).render(markdown);
                }
            );
        }
        if (isRemark)
        {
            //  theme
            applyTheme(baseUrl);

            //  style
            source = applyStyle(source);
            
            source = skipEscape
            (
                source.split("\n"),
                function(line)
                {
                    if (">>>" === line)
                    {
                        line = "---";
                    }
                    return line;
                }
            ).join("\n");
            
            //  remark
            await loadScript("js/remark-latest.min.js");
            const config = JSON.parse((source+"<!--[REMARK-CONFIG] { } -->").split("<!--[REMARK-CONFIG]")[1].split("-->")[0].trim());
            source = skipEscapeBlock
            (
                source,
                function(block)
                {
                    return block.replace(/<!--\[REMARK-CONFIG\][\S\s]*?-->/, "");
                }
            );
            config.source = translateForMathJax
            (
                translateRelativeLink(baseUrl, translateLinkWithinPageForRemark(translateForSlide(source)))
                .replace(/([^\n])```([^\n])/g, "$1`$2")
            );
            remark.create(config);

            //  MathJax
            await tryOrThroughAsync("MathJax", loadMathJaxScript);

            //  twitter
            await tryOrThroughAsync("twitter", loadTwitterScript);

            await hideRendering();
        }
        if (isReveal)
        {
            //  reveal
            appendTheme("css/reveal.css");
            const revealTheme = /<!--\[REVEAL-THEME\]\s*(.*?)\s*-->/.exec(source +"<!--[REVEAL-THEME]league-->")[1].toLowerCase();
            console.log("reveal-theme: " +revealTheme);
            appendTheme("css/theme/" +revealTheme +".css", "theme");
            const documentTheme = document.getElementById("theme") as HTMLLinkElement;
            appendTheme("lib/css/zenburn.css");
            appendTheme(window.location.search.match( /print-pdf/gi ) ? 'css/print/pdf.css' : 'css/print/paper.css');
            
            //  theme
            applyTheme(baseUrl);

            //  style
            source = applyStyle(source);

            makeDomNode
            (
                {
                    parent: document.head,
                    tag: "style",
                    innerHTML: (source+"<!--[STYLE] -->").split("<!--[STYLE]")[1].split("-->")[0].trim(),
                }
            );

            //  paste markdown
            const separator = (source+"<!--[REVEAL-SEPARATOR] ^\\n---$ -->").split("<!--[REVEAL-SEPARATOR]")[1].split("-->")[0].trim();
            const separator_vertical = (source+"<!--[REVEAL-SEPARATOR-VERTICAL] ^\\n>>>$ -->").split("<!--[REVEAL-SEPARATOR-VERTICAL]")[1].split("-->")[0].trim();
            const separator_notes = (source+"<!--[REVEAL-SEPARATOR-NOTES] ^Note: -->").split("<!--[REVEAL-SEPARATOR-NOTES]")[1].split("-->")[0].trim();
            const pasteMarkdown = function(markdown)
            {
                return makeDomNode
                (
                    {
                        parent: document.body,
                        tag: "div",
                        className: "reveal",
                        children:
                        {
                            tag: "div",
                            className: "slides",
                            children:
                            {
                                tag: "section",
                                attributes:
                                {
                                    "data-markdown": "",
                                    "data-separator": separator,
                                    "data-separator-vertical": separator_vertical,
                                    "data-separator-notes": separator_notes,
                                },
                                children:
                                {
                                    tag: "script",
                                    type: "text/template",
                                    innerHTML: translateForMathJax(markdown),
                                },
                            },
                        },
                    }
                );
            };
            pasteMarkdown(translateRelativeLink(baseUrl, translateLinkWithinPageForReveal(translateForSlide(source))));
            await loadScript("lib/js/head.min.js");
            await loadScript("js/reveal.js");
            
            const revealTransition = /<!--\[REVEAL-TRANSITION\]\s*(.*?)\s*-->/.exec(source +"<!--[REVEAL-TRANSITION]concave-->")[1].toLowerCase();
            console.log("reveal-transition: " +revealTransition);
            console.log("reveal-theme(forced by url param): " +Reveal.getQueryHash().theme);
            console.log("reveal-transition(forced by url param): " +Reveal.getQueryHash().transition);
            const forceTheme = Reveal.getQueryHash().theme;
            if (forceTheme)
            {
                documentTheme.href = "css/theme/" +forceTheme +".css";
            }
            // More info about config & dependencies:
            // - https://github.com/hakimel/reveal.js#configuration
            // - https://github.com/hakimel/reveal.js#dependencies
            const config = JSON.parse((source+"<!--[REVEAL-CONFIG] { } -->").split("<!--[REVEAL-CONFIG]")[1].split("-->")[0].trim());
            console.log("reveal-config: " +JSON.stringify(config, null, 4));
            const defaultConfig =
            {
                controls: true,
                progress: true,
                history: true,
                center: true,
                transition: Reveal.getQueryHash().transition || revealTransition, 
                math:
                {
                    mathjax: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js',
                    config: 'TeX-AMS_HTML-full'
                },
                dependencies:
                [
                    { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
                    { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                    { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                    { src: 'plugin/highlight/highlight.js', async: true, callback: function() {
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
            await tryOrThroughAsync("twitter", loadTwitterScript);
            await hideRendering();
        }
        if (isEdit)
        {
            //  edit
            recursiveAssign
            (
                document.body.style,
                {
                    margin: "0",
                    overflow: "hidden",
                    backgroundColor: "#86812A",
                }
            );
            const urlsDiv = makeDomNode
            (
                {
                    parent: document.body,
                    tag:"div",
                    style:
                    {
                        padding: "0.5rem 1.0rem",
                        width: "100%",
                        height: "1rem",
                        verticalAlign: "middle",
                        lineHeight: "1rem",
                    },
                }
            );
            const textCounter = makeDomNode
            (
                {
                    parent: urlsDiv,
                    tag: "span",
                    style:
                    {
                        color: "#CCCCCC",
                        padding: "0rem 1.0rem",
                    }
                }
            ) as HTMLSpanElement;
            const makeLink = function(text) : HTMLAnchorElement
            {
                return makeDomNode
                (
                    {
                        parent: urlsDiv,
                        tag: "a",
                        style:
                        {
                            color: "#FFFFFF",
                            padding: "0rem 1.0rem",
                        },
                        text: text,
                        target: "_blank",
                    }
                ) as HTMLAnchorElement;
            };
            const defaultLink = makeLink("default");
            const markedLink = makeLink("marked(markdown)");
            const commonmarkLink = makeLink("commonmark(markdown)");
            const markdownitLink = makeLink("markdown-it(markdown)");
            const remarkLink = makeLink("remark(slide)");
            const revealLink = makeLink("reveal(slide)");
            const editLink = makeLink("edit");
            const update = function() {
                const text = encodeURIComponent(textarea.value);
                textCounter.innerText = "lenght:" +text.length;
                defaultLink.href = "?text:" +text;
                markedLink.href = "?marked&text:" +text;
                commonmarkLink.href = "?commonmark&text:" +text;
                markdownitLink.href = "?markdown-it&text:" +text;
                remarkLink.href = "?remark&text:" +text;
                revealLink.href = "?reveal&text:" +text;
                editLink.href = "?edit&text:" +text;
            };
            const textarea = makeDomNode
            (
                {
                    parent: document.body,
                    tag: "textarea",
                    style:
                    {
                        width: "100%",
                        height: "100%",
                        margin: "0rem 1rem 1rem 1rem",
                    },
                    value: source,
                    eventListener:
                    {
                        change: update,
                        keyup: update,
                    },
                }
            ) as HTMLTextAreaElement;
            recursiveAssign
            (
                textarea.style,
                {
                    width: "calc(100vw - 2rem)",
                    height: "calc(100vh - 3rem)",
                }
            );
            update();
            await hideRendering();
        }
    };
    const loadGoogleAnalytics = function() : void
    {
        if (globalState && globalState.config && globalState.config.googleAnalyticsTracckingId)
        {
            loadScript("https://www.googletagmanager.com/gtag/js?" +globalState.config.googleAnalyticsTracckingId);
            window["dataLayer"] = window["dataLayer"] || [];

            const gtag = function(_a : any,  _b: any)
            {
                window["dataLayer"].push(arguments);
            };
            gtag("js", new Date());
            gtag("config", globalState.config.googleAnalyticsTracckingId);

        }
    };
    const parseUrlParameters = function(url : string) : object
    {
        const urlParameters =
        {
            "renderer": null,
            "sourceUrl": null,
        };
        const basicUrlArgs = (url.split("#")[0] +"?")
            .split("?")[1]
            .split("&")
            .filter(function(i) { return 0 < i.length; })
            .filter(function(i) { return i.indexOf("=") < 0; })
            .map(function(i) { return decodeURIComponent(i);});
        if (1 <= basicUrlArgs.length)
        {
            if (2 <= basicUrlArgs.length)
            {
                urlParameters.renderer = basicUrlArgs[0];
                urlParameters.sourceUrl = basicUrlArgs[1];
            }
            else
            {
                urlParameters.sourceUrl = basicUrlArgs[0];
            }
        }
        return urlParameters;
    };
    const loadUrlParameters = function() : void
    {
        globalState.urlParameters = parseUrlParameters(location.href);
        console.log
        (
            "⚙️ urlParameters: " +JSON.stringify
            (
                globalState.urlParameters,
                null,
                4
            )
        );

        if (!globalState.urlParameters.sourceUrl)
        {
            globalState.urlParameters.sourceUrl = globalState.config.defaultDocument || "index.md";
        }
        globalState.urlParameters.sourceUrl = globalState.urlParameters.sourceUrl
            .replace(/^(?:https\:)?\/\/github\.com\/([^/]+\/[^/]+)\/blob\/(.*\.md)(#.*)?$/, "https://raw.githubusercontent.com/$1/$2");

        globalState.documentBaseUrl = "text:" === globalState.urlParameters.sourceUrl.slice(0, 5) ?
            location.href:
            makeAbsoluteUrl(location.href, globalState.urlParameters.sourceUrl);
    };
    const loadDocument = async function(sourceUrl : string) : Promise<string>
    {
        return new Promise<string>
        (
            async (resolve, reject) =>
            {
                if ("text:" === sourceUrl.slice(0, 5))
                {
                    //render(globalState.urlParameters.renderer, location.href, globalState.urlParameters.sourceUrl.slice(5));
                    resolve(sourceUrl.slice(5));
                }
                else
                {
                    console.log("📥 loading document: " +sourceUrl);
                    const request = new XMLHttpRequest();
                    request.open('GET', sourceUrl, true);
                    request.onreadystatechange = function()
                    {
                        if (4 === request.readyState)
                        {
                            if (200 <= request.status && request.status < 300)
                            {
                                //render(globalState.urlParameters.renderer, makeAbsoluteUrl(location.href, globalState.urlParameters.sourceUrl), );
                                resolve(request.responseText);
                            }
                            else
                            {
                                showLoadingError(sourceUrl, request);
                                reject();
                            }
                        }
                    };
                    request.send(null);
                }
            }
        );
    };
    const loadJson = async function() : Promise<void>
    {
        return new Promise<void>
        (
            async (resolve) =>
            {
                const jsonScripts = Array.from(document.getElementsByTagName('script'))
                    .filter(function(script) { return "application/json" === script.type; });
                let loadCount = 0;
                jsonScripts.forEach
                (
                    function(script)
                    {
                        const name = script.getAttribute("data-let");
                        const sourceUrl = script.src;
                        console.log("📥 loading json(" +name +"): " +sourceUrl);
                                    const request = new XMLHttpRequest();
                        request.open('GET', sourceUrl, true);
                        request.onreadystatechange = function()
                        {
                            if (4 === request.readyState)
                            {
                                if (200 <= request.status && request.status < 300)
                                {
                                    try
                                    {
                                        objectAssign
                                        (
                                            globalState[name],
                                            JSON.parse(request.responseText)
                                        );
                                        console.log("⚙️ load JSON(" +name +") from " +sourceUrl +" : " +request.responseText);
                                    }
                                    catch(err)
                                    {
                                        console.error(err);
                                        console.error("error JSON(" +sourceUrl +"): " +request.responseText);
                                    }
                    
                                    if (jsonScripts.length <= ++loadCount)
                                    {
                                        resolve();
                                    }
                                }
                                else
                                {
                                    showLoadingError(sourceUrl, request);
                                }
                            }
                        };
                        request.send(null);
                    }
                );
                if (jsonScripts.length <= 0)
                {
                    resolve();
                }
            }
        );
    };
    const startup = async function() : Promise<void>
    {
        await loadJson();
        loadUrlParameters();
        if ("@system-loading-error" === globalState.urlParameters.sourceUrl.toLowerCase())
        {
            //  nop
        }
        else
        if ("@loading" === globalState.urlParameters.sourceUrl.toLowerCase())
        {
            hideSystemLoadingError();
        }
        else
        if ("@rendering" === globalState.urlParameters.sourceUrl.toLowerCase())
        {
            hideSystemLoadingError();
            hideLoading();
        }
        else
        if ("@rendering-error" === globalState.urlParameters.sourceUrl.toLowerCase())
        {
            showRenderingError();
        }
        else
        {
            hideSystemLoadingError();
            const source = await loadDocument(globalState.urlParameters.sourceUrl);
            hideLoading();
            tryOrThrough("GoogleAnalytics", loadGoogleAnalytics);
            try
            {
                await render(globalState.urlParameters.renderer, globalState.documentBaseUrl, source);
            }
            catch(err)
            {
                showRenderingError();
                console.error(`🚫 ${err}`);
            }
        }
    };
    startup();
})();
