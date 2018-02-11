<!--
class: center, middle
-->

# writing

---

## Contents

- [README](#readme)
- [remark HTML](#remark-html)
- [remark themes](#remark-themes)
- [GitHub Pages](#github-pages)

---

<!--
layout: true
-->

## README

---

ここは [@wraith13](https://wraith13.github.io/writing/?wraith13.md) 用の markdown ソースのスライド形式ドキュメント置き場です。

- スライド一覧: <https://wraith13.github.io/writing/>
- GitHub: <https://github.com/wraith13/writing/>

---

この README は markdown としてもスライドとしても表示できます

- markdown: <https://github.com/wraith13/writing/blob/master/README.md>
- スライド: <https://wraith13.github.io/writing/?README.md>

---

スライドのレンダリングエンジンには remark を使ってます

- remark: <https://github.com/gnab/remark>

---

remark 特有の

```html
layout: true
class: center, middle
```

のような指定は HTML コメント内に記述することで markdown として表示する際にも表示されないようにしています。

---

> この README.md では使用していませんが remark において CSS クラスを指定する `.class[ テキスト ]` のような指定は markdown として表示される際にそのまま表示されてしまいますが、これは潔く諦めましょう。

---
<!--
   layout:    true   
-->

## remark HTML

---

remark をよりお手軽に利用する為の HTML を用意しました。

- <https://github.com/wraith13/writing/blob/master/index.html>

---

remark を使い始めたばっかりで remark 本体にある機能を実装してしまってるかもしれません。

HTML と言っても中身は script タグだけです。

> この HTML ファイルのライセンスは [Boost Software License](http://www.boost.org/LICENSE_1_0.txt) となります。

---

### URL引数で指定された markdown を remark でスライド表示

- 相対パスでの指定: <https://wraith13.github.io/writing/?README.md>
- 絶対パスでの指定: <https://wraith13.github.io/writing/?https://wraith13.github.io/writing/README.md>

> 指定が無い場合は同じディレクトリ内の index.md を表示します。

---

### markdown ページ内リンクの自動変換

`#section-title` のような形の markdown ページ内リンクを自動的にスライド表示用に `#n` のような形のページ番号のリンクに変換します。

---

### markdown 内コメントによる指定

- [HTML のタイトルを指定](#markdown-内コメントで-html-のタイトルを指定)
- [HTML の favicon を指定](#markdown-内コメントで-html-の-favicon-を指定)
- [HTML のテーマ(CSSファイル)を指定](#markdown-内コメントで-html-のテーマcssファイルを指定)
- [HTML のスタイル(CSS直書き)を記述](#markdown-内コメントで-html-のスタイルcss直書きを指定)
- [remark のオプションを指定](#markdown-内コメントで-remark-のオプションを指定)

---

#### markdown 内コメントでの指定形式

`<!--[XXX]*-->` の形式で `XXX` が項目名で `*` が指定内容となります。 `*` は前後に空白,タブ,改行があっても構いません。

> 最初は `[XXX]` ではなく `XXX:` の形にしていたのですが remark の挙動とコンフリクトするのでこの形にしました。

---

かなり雑な実装をしている為、以下の記述サンプルはこの README.md の本物の指定となってます。

---

#### markdown 内コメントで HTML のタイトルを指定

```html
<!--[TITLE] writing README -->
```

---

#### markdown 内コメントで HTML の favicon を指定

```html
<!--[FAVICON] https://github.com/wraith13.png -->
```

> markdown からの相対パスでも絶対パスでも構いません。

---

#### markdown 内コメントで HTML のテーマ(CSSファイル)を指定

```html
<!--[THEME] theme/default.css -->
```

> markdown からの相対パスでも絶対パスでも構いません。

---

#### markdown 内コメントで HTML のスタイル(CSS直書き)を指定

```html
<!--[STYLE]
.red {
    color: #FF0000;
}
-->
```

---

#### markdown 内コメントで remark のオプションを指定

```html
<!--[REMARK-CONFIG]
{
    "ratio": "16:9"
}
-->
```

⚠ JSONでの指定となる為、項目名をダブルクォーテーションで括るのを忘れないように注意してください。

---

<!--
layout: true
-->

## remark themes

---

🚧 remark 用のテーマ(CSS)もいくつか準備中です。

<https://github.com/wraith13/writing/tree/master/theme>

> これは remark 用のテーマ集であり、 remark HTML には依存しません。

---

<!--
layout: true
-->

## GitHub Pages

---

GitHub にはリポジトリに格納されてるファイルを https 経由で直接的にアクセスできる機能が提供されおり、このリポジトリもその機能を用いて <https://wraith13.github.io/writing/> からアクセスできるようにしてあります。

---

設定方法は GitHub 上のリポジトリに Web ブラウザでアクセスし、 `Settings`(→`Options`)→`GitHub Pages` のところの `Source` をドロップダウンから選択して `Save` するだけです。

> このプロジェクトでは master ブランチのルートをそのまま公開してるので `Source` は `master branch` にしてあります。

---

<!--
layout: true
-->

---

<!--
class: center, middle
-->

Enjoy!
