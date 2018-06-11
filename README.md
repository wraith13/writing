<!--[NOWRITING]-->
<link rel="canonical" href="https://wraith13.github.io/writing/?README.md" />
この markdown の表示用URL: <a rel="canonical" href="https://wraith13.github.io/writing/?README.md">https://wraith13.github.io/writing/?README.md</a>
<!--[/NOWRITING]-->
<!--
class: center, middle
-->
<!--[REFERRER-OPTION] true -->
<!--[AUTOPAGESEPARATE] true -->

# writing

<!--[NOREVEAL/]<span style="font-size:0.7em;">[markdown](?markdown) | [remark](?remark) | [reveal](?reveal)</span>-->
<!--[REVEAL/]<span style="display:block;margin-left:auto;margin-right:auto;font-size:0.6em;width:450px;text-align:center;white-space:pre;">[markdown](?markdown) | [remark](?remark) | [reveal](?reveal)</span>-->

## Contents

- [README](#readme)
- [writing HTML](#writing-html)
- [remark themes](#remark-themes)
- [remark animation themes](#remark-animation-themes)
- [GitHub Pages](#github-pages)

## README

<!--
layout: true
-->

<!--[NOMD/]----->

ここは [@wraith13](wraith13.md) 用の markdown ソースのスライド形式ドキュメント置き場です。

**⚠ 現状、全然まだドキュメント書いてないし、この README の記述すら全然追いついてません。。。**

- スライド一覧: <https://wraith13.github.io/writing/>
- GitHub: <https://github.com/wraith13/writing/>

<!--[NOMD/]----->

この README は markdown としてもスライドとしても表示できます

- [markdown(marked)](https://wraith13.github.io/writing/?README.md)
- [markdown(commonmark)](<https://wraith13.github.io/writing/?commonmark&README.md)
- [markdown(markdown-it)](<https://wraith13.github.io/writing/?markdown-it&README.md)
- [スライド(remark)](<https://wraith13.github.io/writing/?remark&README.md)
- [スライド(reveal)](<https://wraith13.github.io/writing/?reveal&README.md)

<!--[NOMD/]----->

markdown とスライドのレンダリングエンジンには marked, commonmark, markdown-it, remark, reveal を使ってます

- marked: <https://github.com/markedjs/marked>
- commonmark: <https://github.com/commonmark/commonmark.js>
- markdown-it: <https://github.com/markdown-it/markdown-it>
- remark: <https://github.com/gnab/remark>
- reveal: <https://github.com/hakimel/reveal.js/>

<!--[NOMD/]----->

remark 特有の

```html
layout: true
class: center, middle
```

のような指定は HTML コメント内に記述することで markdown として表示する際に表示されないようにしています。

<!--[NOMD/]----->

> この README.md では使用していませんが remark において CSS クラスを指定する `.class[ テキスト ]` のような指定は markdown として表示される際にそのまま表示されてしまいますが、これは潔く諦めましょう。

## writing HTML

<!--
   layout:    true   
-->

<!--[NOMD/]----->

marked, remark, reveal を手軽に利用する為の HTML を用意しました。

- <https://github.com/wraith13/writing/blob/master/index.html>

<!--[NOMD/]----->

HTML と言っても中身はほぼ script タグだけです。

<!--[REVEAL/]>>>-->

> この HTML ファイルのライセンスは [Boost Software License](http://www.boost.org/LICENSE_1_0.txt) となります。

### URL引数で指定された markdown を表示

- 相対パスでの指定: <https://wraith13.github.io/writing/?README.md>
- 絶対パスでの指定: <https://wraith13.github.io/writing/?https://wraith13.github.io/writing/README.md>

<!--[REVEAL/]>>>-->

markdown 内のコメントで明示されたレンダラーでレンダリングされます。明示されてない場合は markdown で表示されます。

### URL引数で指定された markdown を marked で表示

- 相対パスでの指定: <https://wraith13.github.io/writing/?markdown&README.md>
- 絶対パスでの指定: <https://wraith13.github.io/writing/?markdown&https://wraith13.github.io/writing/README.md>

### URL引数で指定された markdown を commonmark で表示

- 相対パスでの指定: <https://wraith13.github.io/writing/?commonmark&README.md>
- 絶対パスでの指定: <https://wraith13.github.io/writing/?commonmark&https://wraith13.github.io/writing/README.md>

### URL引数で指定された markdown を markdown-it で表示

- 相対パスでの指定: <https://wraith13.github.io/writing/?markdown-it&README.md>
- 絶対パスでの指定: <https://wraith13.github.io/writing/?markdown-it&https://wraith13.github.io/writing/README.md>

### URL引数で指定された markdown を remark でスライド表示

- 相対パスでの指定: <https://wraith13.github.io/writing/?markdown&README.md>
- 絶対パスでの指定: <https://wraith13.github.io/writing/?markdown&https://wraith13.github.io/writing/README.md>

### URL引数で指定された markdown を reveal でスライド表示

- 相対パスでの指定: <https://wraith13.github.io/writing/?reveal&README.md>
- 絶対パスでの指定: <https://wraith13.github.io/writing/?reveal&https://wraith13.github.io/writing/README.md>

### URL引数で指定された markdown をソースにインスタント編集

- 相対パスでの指定: <https://wraith13.github.io/writing/?reveal&README.md>
- 絶対パスでの指定: <https://wraith13.github.io/writing/?reveal&https://wraith13.github.io/writing/README.md>

### URLではなくテキストで指定

<https://wraith13.github.io/writing/?text:%23%20title%0A%0A%23%23%20header%0A%0Amessage>

### markdown ページ内リンクの自動変換

`#section-title` のような形の markdown ページ内リンクを自動的にレンダリングシステムに合わせたリンクに変換します。

### markdown 内コメントによる指定

- [レンダリングエンジンを指定](#markdown-内コメントでレンダリングエンジンを指定)
- [HTML のタイトルを指定](#markdown-内コメントで-html-のタイトルを指定)
- [HTML の favicon を指定](#markdown-内コメントで-html-の-favicon-を指定)
- [HTML のテーマ(CSSファイル)を指定](#markdown-内コメントで-html-のテーマcssファイルを指定)
- [HTML のスタイル(CSS直書き)を記述](#markdown-内コメントで-html-のスタイルcss直書きを指定)
- [remark のオプションを指定](#markdown-内コメントで-remark-のオプションを指定)

#### markdown 内コメントでの指定形式

`<!--[XXX]*-->` の形式で `XXX` が項目名で `*` が指定内容となります。 `*` は前後に空白,タブ,改行があっても構いません。

<!--[REVEAL/]>>>-->

> 最初は `[XXX]` ではなく `XXX:` の形にしていたのですが remark の挙動とコンフリクトするのでこの形にしました。

<!--[NOMD/]----->

かなり雑な実装をしている為、以下の記述サンプルはこの README.md の本物の指定となってます。

#### markdown 内コメントでレンダリングエンジンを指定

```html
<!--[RENDERER] markdown -->
```

#### markdown 内コメントで HTML のタイトルを指定

```html
<!--[TITLE] writing README -->
```

#### markdown 内コメントで HTML の favicon を指定

```html
<!--[FAVICON] https://wraith13.github.io/writing/writinghex.128.png -->
```

> markdown からの相対パスでも絶対パスでも構いません。

#### markdown 内コメントで HTML のテーマ(CSSファイル)を指定

```html
<!--[THEME] theme/default.css -->
```

<!--[REVEAL]-->
<!--[REVEAL-THEME] league -->
<!--[REVEAL-TRANSITION] zoom -->
<!--[/REVEAL]-->

> markdown からの相対パスでも絶対パスでも構いません。

#### markdown 内コメントで HTML のスタイル(CSS直書き)を指定

```html
<!--[STYLE]
.red {
    color: #FF0000;
}
-->
```

#### markdown 内コメントで remark のオプションを指定

```html
<!--[REMARK-CONFIG]
{
    "ratio": "16:9"
}
-->
```

⚠ JSONでの指定となる為、項目名をダブルクォーテーションで括るのを忘れないように注意してください。

## remark themes

<!--
layout: true
-->

<!--[NOMD/]----->

🚧 remark 用のテーマ(CSS)もいくつか準備中です。

<https://github.com/wraith13/writing/tree/master/theme>

> これは remark 用のテーマ集であり、 remark HTML には依存しません。

## remark animation themes

<!--
layout: true
-->

<!--[NOMD/]----->

remark 用のアニメーションテーマ(CSS)として fade.css と slide.css を用意しました。
ページ遷移時にエフェクトがかかるヤツです。
単独であるいは remark themes と合わせてご利用ください。

<https://github.com/wraith13/writing/tree/master/animation>

## GitHub Pages

<!--
layout: true
-->

<!--[NOMD/]----->

GitHub にはリポジトリに格納されてるファイルを https 経由で直接的にアクセスできる機能が提供されおり、このリポジトリもその機能を用いて <https://wraith13.github.io/writing/> からアクセスできるようにしてあります。

<!--[NOMD/]----->

設定方法は GitHub 上のリポジトリに Web ブラウザでアクセスし、 `Settings`(→`Options`)→`GitHub Pages` のところの `Source` をドロップダウンから選択して `Save` するだけです。

<!--[REVEAL/]>>>-->

> このプロジェクトでは master ブランチのルートをそのまま公開してるので `Source` は `master branch` にしてあります。

<!--[NOMD/]----->

<!--[NOREVEAL]-->
<!--
layout: true
-->
<!--[/NOREVEAL]-->

## end of document

- [back to writing](./index.md)
