'use strict';
//  The license of this file is Boost Software License, Version 1.0. ( Http://www.boost.org/LICENSE_1_0.txt ).
//  このファイルのライセンスは Boost Software License, Version 1.0. ( http://www.boost.org/LICENSE_1_0.txt ) とします。

declare var hljs: any;
declare var marked: any;
declare var remark: any;
declare var commonmark: any;
declare var Reveal: any;

interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}
declare interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}

(function()
{
    let globalState : any =
    {
        "config": { }
    };
    let explicitFragmentIdPattern = /\{\#(.*?)\}$/;

    RegExp["escape"] = function(s : string) : string
    {
        //  https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    let objectAssign = function(target : object, source : object) : object
    {
        //  copy from https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
        if (typeof Object.assign !== 'function') {
            (function () {
                Object.assign = function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                let output = Object(target);
                for (let index = 1; index < arguments.length; index++) {
                    let source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (let nextKey in source) {
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
    let deepCopy = function(source : object) : object
    {
        return JSON.parse(JSON.stringify(source));
    };
    let recursiveAssign = function(target : object, source : object) : void
    {
        for(let key in source)
        {
            if (source.hasOwnProperty(key))
            {
                let value = source[key];
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
    let practicalTypeof = function(obj : any) : string
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
    let makeDomNode = function(arg : any) : Node
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
    let setToElement = function(element : Element, arg : any) : Node
    {
        for(let key in arg)
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
                    let value = arg[key];
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
            for(let key in arg.attributes)
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
            for(let key in arg.eventListener)
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
    let hideSystemLoadingError = function () : void
    {
        var systemLoadingErrorElement = document.getElementsByClassName("writing-HTML-system-loading-error")[0];
        if (systemLoadingErrorElement)
        {
            systemLoadingErrorElement.className = "";
            systemLoadingErrorElement.innerHTML = "";
            console.log("✅ system loading succeeded.");
        }
    };
    let showError = function(arg) : void
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
    };
    let showLoadingError = function(sourceUrl, request) : void
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
        let responseDiv : any =
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
    let appendLink = function(args : object) : void
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
    let appendTheme = function(href : string, id : string = undefined) : void
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
    let appendHighlightTheme = function() : void
    {
        appendTheme("//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css");
    };
    let appendIcon = function(href : string) : void
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
    let loadScript = function(src : string, onload : () => void = undefined) : void
    {
        makeDomNode
        (
            {
                parent: document.head,
                tag: "script",
                src: src,
                onload: onload,
            }
        );
    };
    let loadHighlightScript = function() : void
    {
        loadScript
        (
            "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js",
            function()
            {
                hljs.initHighlightingOnLoad();
                applyHighlight();
            }
        );
    };
    let loadMathJaxScript = function() : void
    {
        loadScript("//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML");
    };
    let loadTwitterScript = function()
    {
        loadScript("//platform.twitter.com/widgets.js");
    };
    let makeAbsoluteUrl = function(base : string, url : string) : string
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
    let makeRelativeUrl = function(url : string) : string
    {
        let base = location.href.split("#")[0];
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
    let makeRebaseUrl = function(base : string, url : string) : string
    {
        if ("#" === url.substr(0, 1))
        {
            return url;
        }
        return makeRelativeUrl(makeAbsoluteUrl(base, url));
    };
    let skipEscape = function
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
                let escape = "$$" === line.trim() ? "$$": line.trim().replace(/^(```+|~~~+).*/, "$1").replace(/^[`~]{0,2}(([^`~].*)|$)/,"");
                let isEscape = null === currentEscape && ("" !== escape) || (null !== currentEscape && currentEscape.substr(0,1) === escape.substr(0,1) && currentEscape.length <= escape.length);
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
    let skipEscapeBlock = function
    (
        source : string,
        map : (string) => string,
        escapeMap : (string) => string = undefined,
        finish : () => void = undefined
    ) : string
    {
        let blocks = [];
        let current = [];
        let isInEscape = false;
        skipEscape
        (
            source.split("\n"),
            function(line)
            {
                if (isInEscape)
                {
                    let currentBlock = current.join("\n");
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
                    let currentBlock = current.join("\n");
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
            let currentBlock = current.join("\n");
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
            let currentBlock = current.join("\n");
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
    let applyOption = function
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
                let reg = new RegExp("<!--\\[" +TAG +"\\]\\s*([\\s\\S]*?)\\s*-->", "gm");
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
    let loadConfig = function(source : string) : string
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
            let explicitFragmentIdMatch = line.match(explicitFragmentIdPattern);
            let link = explicitFragmentIdMatch ?
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
    let getAllElements = function(parent : Element | Document = undefined) : Element[]
    {
        let result = [];
        parent = parent || document ;
        if (parent.children)
        {
            for (let i in parent.children)
            {
                let child = parent.children[i];
                if (child)
                {
                    result.push(child);
                    result = result.concat(getAllElements(child));
                }
            }
        }
        return result;
    };
    let getHeadingTags = function() : Element[]
    {
        return getAllElements().filter
        (
            function(i)
            {
                return /^h\d+$/i.test(i.tagName);
            }
        );
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
    let makeIndexFromContent = function() : IndexItem[]
    {
        let linkMaker = new MarkdownHeaderFragmentMaker();
        let anchors : IndexItem[] = [];
        getHeadingTags().forEach
        (
            function(i)
            {
                let level = parseInt(i.tagName.substr(1), 10);
                let title = i.textContent.trim();
                if (!i.id)
                {
                    i.id = linkMaker.makeFragment(title);
                }
                let link = "#" +i.id;
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

    let translateRelativeUrl = function(baseUrl : string, url : string) : string
    {
        if ("?" === url.substr(0, 1))
        {
            return url +"&" +encodeURIComponent(makeRelativeUrl(baseUrl));
        }
        else
        if ("#" !== url.substr(0, 1))
        {
            let absoluteUrl = makeAbsoluteUrl(baseUrl, url);
            let relativeUrl = makeRelativeUrl(absoluteUrl);
            if (/.*\.md(\.txt)?(#.*)?$/i.test(absoluteUrl))
            {
                let thisPath = location.href.split("#")[0].split("?")[0];
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
    let translateRelativeLink = function(baseUrl : string, source : string) : string
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
                                let re = /(.*?[^\\])?\]\((.*?[^\\])\)/g;
                                if (null !== (match = re.exec(part)))
                                {
                                    let label = undefined === match[1] ? "": match[1];
                                    let url = match[2];
                                    let traslatedUrl = translateRelativeUrl(baseUrl, url);
                                    if (url !== traslatedUrl)
                                    {
                                        part = part.replace(match[0], label +"](" +traslatedUrl +")");
                                    }
                                }
                            }

                            let re = /(^|[^\\])\[(.*?[^\\])?\]\((.*?[^\\])\)/g;
                            while(null !== (match = re.exec(part)))
                            {
                                let label = undefined === match[2] ? "": match[2];
                                let url = match[3];
                                let traslatedUrl = translateRelativeUrl(baseUrl, url);
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

                            let img_re = /\<(\s*)img(\s.*?)src=([\"\'])(.*?)([\"\'].*?)\>/g;
                            while(null !== (match = img_re.exec(part)))
                            {
                                let url = match[4];
                                let absoluteUrl = makeAbsoluteUrl(baseUrl, url);
                                let relativeUrl = makeRelativeUrl(absoluteUrl);
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
    let translateLinkWithinPageForRemark = function(source : string) : string
    {
        let lines = source.split("\n");
        let anchors = [ ];
        let page = 1;
        let isLayout = false;
        skipEscape
        (
            lines,
            function(line)
            {
                let trimed_line = line.trim();
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
                    let anchor = trimed_line.replace(/^#*/, "").trim().toLowerCase().replace(/[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/g,"").replace(/ /g,"-");
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
    let translateLinkWithinPageForReveal = function(source : string) : string
    {
        let lines = source.split("\n");
        let anchors = [ ];
        let page = 0;
        skipEscape
        (
            lines,
            function(line)
            {
                let trimed_line = line.trim();
                if ("--" === line || "---" === line)
                {
                    ++page;
                }
                else
                if (/^#+ [^ ]+/.test(trimed_line))
                {
                    let anchor = trimed_line.replace(/^#*/, "").trim().toLowerCase().replace(/[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/g,"").replace(/ /g,"-");
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
    let translateForSlide = function(source : string) : string
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
            let lines = source.split("\n");
            let h1Count = 0;
            skipEscape
            (
                lines,
                function(line)
                {
                    let trimed_line = line.trim();
                    if (/^# [^ ]+/.test(trimed_line))
                    {
                        ++h1Count;
                    }
                    return line;
                }
            );

            let isFirst = true;
            let withJackUp = 1 < h1Count;
            return skipEscape
            (
                lines,
                function(line)
                {
                    let trimed_line = line.trim();
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
    let translateForMathJax = function(source : string) : string
    {
        return source.replace
        (
            /\n\$\$\n([\W\w]*?)\n\$\$\n/g,
            "\n<pre class=\"mathjax\">\n$$$$\n$1\n$$$$\n</pre>\n"
        );
    };
    let applyTitle = function(source : string) : void
    {
        if (undefined === globalState.config.title || "" === globalState.config.title)
        {
            let matches = /(^|\n)#\s+(.*)([\W\w]*)/.exec(source);
            if (matches)
            {
                globalState.config.title = matches[2];
            }

            if (undefined === globalState.config.title || "" === globalState.config.title)
            {
                let context =
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
    let applyIcon = function(baseUrl : string) : void
    {
        appendIcon
        (
            globalState.config.favicon ?
                makeAbsoluteUrl(baseUrl, globalState.config.favicon):
                makeAbsoluteUrl(location.href, "writinghex.128.png")
        );
    };
    let applyTheme = function(baseUrl : string) : void
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
    let applyStyle = function(source : string) : string
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
    let applyWallPaper = function(baseUrl : string) : void
    {
        document.body.className = "markdown";
        if (globalState.config.wallpaper)
        {
            document.body.className += " with-wallpaper";
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
    let applyIndex = function(_source : string)
    {
        let index = null;
        if (undefined === globalState.config.withIndex || globalState.config.withIndex)
        {
            index = makeIndexFromContent();
            if (index && 0 < index.length)
            {
                document.body.className += " with-index";
                let contentDiv = document.getElementsByClassName("content")[0];
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
    let applyIndexScript = function(index) : void
    {
        if (index)
        {
            let previousState = { i: 0 }; // 本来は -1 で初期化するべきだが、それだと後ろの setTimeout(document.body.onscroll, 0); による初期表示が意図通りに機能しないので 0 にしてる。 
            let isOver = function(i)
            {
                return index.length <= i ||
                        (0 <= i && 32 < document.getElementById(index[i].link.substring(1)).getBoundingClientRect().top);
            };
            let previousContent = null;
            for(let i in index)
            {
                let content = document.getElementById(index[i].link.substring(1));
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
                document.body.onscroll = function()
                {
                    let previouseContetIsOver = isOver(previousState.i);
                    let nextContetIsOver = isOver(previousState.i +1);
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
                        let targetIndex = previousState.i < 0 ? null: index[previousState.i];
                        let current = document.getElementsByClassName("current")[0];
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
                                let frame = document.getElementsByClassName("index-frame")[0];
                                if (null === targetIndex)
                                {
                                    frame.scrollTop = 0;
                                }
                                else
                                {
                                    let rect = targetIndex.anchor.getBoundingClientRect();
                                    let targetTop = rect.top +frame.scrollTop;
                                    frame.scrollTop = targetTop - Math.min(frame.clientHeight -rect.height, ((targetTop / frame.scrollHeight) *frame.clientHeight));
                                }
                            }
                        }
                    }
                };
                setTimeout(document.body.onscroll, 0);
            }
        }
    };
    let applyContent = function(html : string) : HTMLDivElement
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
    let applyFragmentId = function() : void
    {
        //  body.onload の時点ではコンテンツが間に合っておらず、 Web ブラウザによる通常のフラグメント識別子位置への
        //  スクロールは期待できない為、コンテンツの取得及びDOM生成完了後に明示的にスクロール位置の移動を行う。
        let fragmentId = decodeURI((location.href +"#").split("#")[1].trim());
        if (fragmentId)
        {
            location.href = "#" +fragmentId;
        }
    };
    let applyHighlight = function() : void
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
    let applyConditionalComment = function(source : string, condition : boolean, TAG : string) : string
    {
        return source
            .replace(new RegExp("<!--\\[" +TAG +"\\/\\]([\\s\\S]*?)-->", "g"), condition ? "$1": "")
            .replace(new RegExp("<!--\\[" +TAG +"\\]-->([\\s\\S]*?)<!--\\[\\/" +TAG +"\\]-->", "g"), condition ? "$1": "")
            .replace(new RegExp("<!--\\[NO" +TAG +"\\/\\]([\\s\\S]*?)-->", "g"), !condition ? "$1": "")
            .replace(new RegExp("<!--\\[NO" +TAG +"\\]-->([\\s\\S]*?)<!--\\[\\/NO" +TAG +"\\]-->", "g"), !condition ? "$1": "");
    };
    let unescapeBackSlash = function(source) : string
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

    let render = function(renderer : string, baseUrl : string, source : string) : void
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
            let currentUrlParamNames = (location.href.split("#")[0] +"?")
                .split("?")[1]
                .split("&")
                .filter(function(i) { return 0 < i.indexOf("="); })
                .map(function(i) { return i.substr(0, i.indexOf("=")); });
            let referrerUrlParams = (document.referrer.split("#")[0] +"?")
                .split("?")[1]
                .split("&")
                .filter(function(i) { return 0 < i.indexOf("="); })
                .filter
                (
                    function(i)
                    {
                        let name = i.substr(0, i.indexOf("="));
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
                    let urlArgs = (document.referrer.split("#")[0] +"?")
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
        let isWriting = true;
        let isMarked = "marked" === renderer;
        let isCommonMark = "commonmark" === renderer;
        let isMarkdownIt = "markdown-it" === renderer;
        let isMarkdown = isMarked || isCommonMark || isMarkdownIt || "markdown" === renderer;
        let isRemark = "remark" === renderer;
        let isReveal = "reveal" === renderer;
        let isEdit = "edit" === renderer;
        if (!isMarkdown && !isRemark && !isReveal && !isEdit)
        {
            let message = "Unknown Rederer Name: \"" +renderer +"\" ( Rederer Names: \"markdown\"(default), \"remark\", \"reveal\", \"edit\" )";
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

        let applyMarkdown = function(markdownToHtml : (string) => string) : void
        {
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

            //  index
            applyIndex(source);

            //  fragment id
            applyFragmentId();

            //  highlight
            loadHighlightScript();

            //  MathJax
            loadMathJaxScript();

            //  twitter
            loadTwitterScript();

            console.log("✅ document redering succeeded.");
        };

        if (isMarked)
        {
            //  marked
            loadScript
            (
                "js/marked.js",
                function()
                {
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
                    let linkMaker = new MarkdownHeaderFragmentMaker();
                    let markedRenderer = new marked.Renderer();
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
            );
        }
        if (isCommonMark)
        {
            //  commonmark
            loadScript
            (
                "js/commonmark.js",
                function()
                {
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
            );
        }
        if (isMarkdownIt)
        {
            //  markdown-it
            loadScript
            (
                "js/markdown-it.js",
                function()
                {
                    loadScript
                    (
                        "js/markdown-it-emoji.js",
                        function()
                        {
                            applyMarkdown
                            (
                                function(markdown)
                                {
                                    var markdownitWindow : any = window;
                                    return markdownitWindow.markdownit({ html: true, }).use(markdownitWindow.markdownitEmoji).render(markdown);
                                }
                            );
                        }
                    );
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
            loadScript
            (
                "js/remark-latest.min.js",
                function()
                {
                    let config = JSON.parse((source+"<!--[REMARK-CONFIG] { } -->").split("<!--[REMARK-CONFIG]")[1].split("-->")[0].trim());
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
                    console.log("✅ document redering succeeded.");
                }
            );

            //  MathJax
            loadMathJaxScript();

            //  twitter
            loadTwitterScript();
        }
        if (isReveal)
        {
            //  reveal
            appendTheme("css/reveal.css");
            let revealTheme = /<!--\[REVEAL-THEME\]\s*(.*?)\s*-->/.exec(source +"<!--[REVEAL-THEME]league-->")[1].toLowerCase();
            console.log("reveal-theme: " +revealTheme);
            appendTheme("css/theme/" +revealTheme +".css", "theme");
            let documentTheme = document.getElementById("theme") as HTMLLinkElement;
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
            let separator = (source+"<!--[REVEAL-SEPARATOR] ^\\n---$ -->").split("<!--[REVEAL-SEPARATOR]")[1].split("-->")[0].trim();
            let separator_vertical = (source+"<!--[REVEAL-SEPARATOR-VERTICAL] ^\\n>>>$ -->").split("<!--[REVEAL-SEPARATOR-VERTICAL]")[1].split("-->")[0].trim();
            let separator_notes = (source+"<!--[REVEAL-SEPARATOR-NOTES] ^Note: -->").split("<!--[REVEAL-SEPARATOR-NOTES]")[1].split("-->")[0].trim();
            let pasteMarkdown = function(markdown)
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
            loadScript
            (
                "lib/js/head.min.js",
                function()
                {
                    loadScript
                    (
                        "js/reveal.js",
                        function()
                        {
                            let revealTransition = /<!--\[REVEAL-TRANSITION\]\s*(.*?)\s*-->/.exec(source +"<!--[REVEAL-TRANSITION]concave-->")[1].toLowerCase();
                            console.log("reveal-transition: " +revealTransition);
                            console.log("reveal-theme(forced by url param): " +Reveal.getQueryHash().theme);
                            console.log("reveal-transition(forced by url param): " +Reveal.getQueryHash().transition);
                            let forceTheme = Reveal.getQueryHash().theme;
                            if (forceTheme)
                            {
                                documentTheme.href = "css/theme/" +forceTheme +".css";
                            }
                            // More info about config & dependencies:
                            // - https://github.com/hakimel/reveal.js#configuration
                            // - https://github.com/hakimel/reveal.js#dependencies
                            let config = JSON.parse((source+"<!--[REVEAL-CONFIG] { } -->").split("<!--[REVEAL-CONFIG]")[1].split("-->")[0].trim());
                            console.log("reveal-config: " +JSON.stringify(config, null, 4));
                            let defaultConfig =
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
                            loadTwitterScript();
                            console.log("✅ document redering succeeded.");
                        }
                    );
                }
            );
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
            let urlsDiv = makeDomNode
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
            let textCounter = makeDomNode
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
            let makeLink = function(text) : HTMLAnchorElement
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
            let defaultLink = makeLink("default");
            let markedLink = makeLink("marked(markdown)");
            let commonmarkLink = makeLink("commonmark(markdown)");
            let markdownitLink = makeLink("markdown-it(markdown)");
            let remarkLink = makeLink("remark(slide)");
            let revealLink = makeLink("reveal(slide)");
            let editLink = makeLink("edit");
            let update = function() {
                let text = encodeURIComponent(textarea.value);
                textCounter.innerText = "lenght:" +text.length;
                defaultLink.href = "?text:" +text;
                markedLink.href = "?marked&text:" +text;
                commonmarkLink.href = "?commonmark&text:" +text;
                markdownitLink.href = "?markdown-it&text:" +text;
                remarkLink.href = "?remark&text:" +text;
                revealLink.href = "?reveal&text:" +text;
                editLink.href = "?edit&text:" +text;
            };
            let textarea = makeDomNode
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
            console.log("✅ document redering succeeded.");
        }
    };
    var loadGoogleAnalytics = function() : void
    {
        if (globalState && globalState.config && globalState.config.googleAnalyticsTracckingId)
        {
            loadScript("https://www.googletagmanager.com/gtag/js?" +globalState.config.googleAnalyticsTracckingId);
            window["dataLayer"] = window["dataLayer"] || [];

            var gtag = function(_a : any,  _b: any)
            {
                window["dataLayer"].push(arguments);
            };
            gtag("js", new Date());
            gtag("config", globalState.config.googleAnalyticsTracckingId);

        }
    };
    let parseUrlParameters = function(url : string) : object
    {
        var urlParameters =
        {
            "renderer": null,
            "sourceUrl": null,
        };
        var basicUrlArgs = (url.split("#")[0] +"?")
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
    let loadUrlParameters = function() : void
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
    let loadDocument = async function(sourceUrl : string) : Promise<string>
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
                    let request = new XMLHttpRequest();
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
    let loadJson = async function() : Promise<void>
    {
        return new Promise<void>
        (
            async (resolve) =>
            {
                let jsonScripts = Array.from(document.getElementsByTagName('script'))
                .filter(function(script) { return "application/json" === script.type; });
                let loadCount = 0;
                jsonScripts.forEach
                (
                    function(script)
                    {
                        let name = script.getAttribute("data-let");
                        let sourceUrl = script.src;
                        console.log("📥 loading json(" +name +"): " +sourceUrl);
                                    let request = new XMLHttpRequest();
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
    let startup = async function() : Promise<void>
    {
        await loadJson();
        loadUrlParameters();
        if ("@system-loading-error" === globalState.urlParameters.sourceUrl.toLowerCase())
        {
            //  nop
        }
        else
        {
            hideSystemLoadingError();
            var source = await loadDocument(globalState.urlParameters.sourceUrl);
            loadGoogleAnalytics();
            render(globalState.urlParameters.renderer, globalState.documentBaseUrl, source);
        }
    };
    startup();
})();
