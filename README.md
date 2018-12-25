# writing README

<!--[NOWRITING]-->
<link rel="canonical" href="https://wraith13.github.io/writing/?@README.md" />
This markdown display URL: <a rel="canonical" href="https://wraith13.github.io/writing/?@README.md">https://wraith13.github.io/writing/?@README.md</a>
<!--[/NOWRITING]-->

<!--[NOREVEAL/]<span style="font-size:0.7em;">[markdown](?markdown) | [remark](?remark) | [reveal](?reveal)</span>-->
<!--[REVEAL/]<span style="display:block;margin-left:auto;margin-right:auto;font-size:0.6em;width:450px;text-align:center;white-space:pre;">[markdown](?markdown) | [remark](?remark) | [reveal](?reveal)</span>-->
<!--[REMARK-CONFIG]
{
    "ratio": "16:9"
}
-->

`writing` is a markdown rendering system.

- live site: <https://wraith13.github.io/writing/>
- GitHub: <https://github.com/wraith13/writing/>

## feature

- ✅ Documents can be displayed using [marked](https://github.com/markedjs/marked), [commonmark](https://github.com/commonmark/commonmark.js), [markdown-it](https://github.com/markdown-it/markdown-it) rendering engines.
- ✅ Slides can be displayed using [remark](https://github.com/gnab/remark), [reveal](https://github.com/hakimel/reveal.js/) rendering engines.
- ✅ [External markdown and instant display possible](https://wraith13.github.io/writing/?@README.md#play-now).
- ✅ Supports mathjax, [plantuml](@demo/plantuml.md), [mermaid](@demo/mermaid.md), [twitter](@demo/twitter.md), google analytics.

## as demo

This README can be displayed as document or slide.

- [document(marked)](https://wraith13.github.io/writing/?marked&@README.md)
- [document(commonmark)](https://wraith13.github.io/writing/?commonmark&@README.md)
- [document(markdown-it)](https://wraith13.github.io/writing/?markdown-it&@README.md)
- [slide(remark)](https://wraith13.github.io/writing/?remark&@README.md)
- [slide(reveal)](https://wraith13.github.io/writing/?reveal&@README.md)

see [others demos](https://wraith13.github.io/writing/?@demo/index.md).

## play now!

<!--[NOWRITING]-->
- [new document/slide](https://wraith13.github.io/writing/?edit&text:)
<!--[/NOWRITING]-->
<!--[WRITING/]
- [new document/slide](?edit&text:)
- <input id="url-input" style="width:30vw;font-size:1em;line-height:1em;padding:0.2em;" placeholder="your markdown URL"> <button onclick="location.href='?'+encodeURIComponent(document.getElementById('url-input').value);" style="font-size:1em;line-height:1em;padding:0.2em;">open</button>
-->

## usage

1. Fork [this repository](https://github.com/wraith13/writing/) on GitHub.
1. Edit `./writing.config.json`, commit, and push.
1. Go `Settings`(→`Options`)→`GitHub Pages`, select `master branch` from drop down list, and click `Save`.

For details, see [writing usage](usage.md).

## end of document

<!--[NOWRITING]-->
- [back to writing index](./index.md)
<!--[/NOWRITING]-->
<!--[WRITING/]- [back to writing index](@./)-->