<!--[NOWRITING]-->
この markdown の表示用URL: <https://wraith13.github.io/writing/?demo/reveal.md>
<!--[/NOWRITING]-->
<!--[TITLE] reveal.js – The HTML Presentation Framework -->
<!--[RENDERER] REVEAL -->
<!--[REVEAL-THEME] black -->
<!--[REVEAL-TRANSITION] slide -->
<!--[THEME] ../theme/null.css -->
<!--[STYLE]
body:not(.remark-container) :not(pre) > code
{
    display: inline;
    padding: 0.2em;
}
table
{
    color: inherit;
    font-size: inherit;
}
-->

# Reveal.js

### The HTML Presentation Framework

<small>Created by [Hakim El Hattab](http://hakim.se) and [contributors](https://github.com/hakimel/reveal.js/graphs/contributors)</small>

<!--[NOMD/]----->

## Hello There

reveal.js enables you to create beautiful interactive slide decks using HTML. This presentation will show you examples of what it can do.

<!--[NOMD/]----->

## Vertical Slides

Slides can be nested inside of each other.

Use the <em>Space</em> key to navigate through all slides.

<br>
<a href="#" class="navigate-down">
    ![Down arrow](https://s3.amazonaws.com/hakim-static/reveal-js/arrow.png)
</a>

<!--[REMARK/]----->
<!--[REVEAL/]>>>-->

## Basement Level 1

Nested slides are useful for adding additional detail underneath a high level horizontal slide.

<!--[REMARK/]----->
<!--[REVEAL/]>>>-->

## Basement Level 2

That's it, time to go back up.

<!--[MD]-->
---
<!--[/MD]-->
<!--[NOMD/]<hr/>-->

<a href="#/2">
    <img width="178" height="238" src="https://s3.amazonaws.com/hakim-static/reveal-js/arrow.png" alt="Up arrow" style="transform: rotate(180deg); -webkit-transform: rotate(180deg);">
</a>

<!--[NOMD/]----->

## Slides

Not a coder? Not a problem. There's a fully-featured visual editor for authoring these, try it out at <a href="https://slides.com" target="_blank">https://slides.com</a>.

<!--[NOMD/]----->

## Point of View

Press <strong>ESC</strong> to enter the slide overview.

Hold down alt and click on any element to zoom in on it using <a href="http://lab.hakim.se/zoom-js">zoom.js</a>. Alt + click anywhere to zoom back out.

<!--[NOMD/]----->

## Touch Optimized

Presentations look great on touch devices, like mobile phones and tablets. Simply swipe through your slides.

<!--[NOMD/]----->

## Markdown support

Write content using inline or external Markdown.
Instructions and more info available in the [readme](https://github.com/hakimel/reveal.js#markdown).

```html
<section data-markdown>
    ## Markdown support

    Write content using inline or external Markdown.
    Instructions and more info available in the [readme](https://github.com/hakimel/reveal.js#markdown).
</section>
```

<!--[NOMD/]----->

## Fragments

Hit the next arrow...

... to step through ...<!-- .element: class="fragment" -->

<span class="fragment">... a</span> <span class="fragment">fragmented</span> <span class="fragment">slide.</span>

Note:
This slide has fragments which are also stepped through in the notes window.

<!--[NOMD/]----->

## Fragment Styles

There's different types of fragments, like:

grow<!-- .element: class="fragment grow" -->

shrink<!-- .element: class="fragment shrink" -->

fade-out<!-- .element: class="fragment fade-out" -->

fade-up (also down, left and right!)<!-- .element: class="fragment fade-up" -->

current-visible<!-- .element: class="fragment >current-visible" -->

Highlight <span class="fragment highlight-red">red</span> <span class="fragment highlight-blue">blue</span> <span class="fragment highlight-green">green</span>

<!--[NOMD/]----->

## Transition Styles

You can select from different transitions, like:

[None](?transition=none&demo/reveal.md#/9) -
[Fade](?transition=fade&demo/reveal.md#/9) -
[Slide](?transition=slide&demo/reveal.md#/9) -
[Convex](?transition=convex&demo/reveal.md#/9) -
[Concave](?transition=concave&demo/reveal.md#/9) -
[Zoom](?transition=zoom&demo/reveal.md#/9)

<!--[NOMD/]----->

## Themes

reveal.js comes with a few themes built in:

<!-- Hacks to swap themes after the page has loaded. Not flexible and only intended for the reveal.js demo deck. -->
[Black (default)](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/black.css'); return false;" --> -
[White](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/white.css'); return false;" --> -
[League](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/league.css'); return false;" --> -
[Sky](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/sky.css'); return false;" --> -
[Beige](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/beige.css'); return false;" --> -
[Simple](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/simple.css'); return false;" --> -
[Serif](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/serif.css'); return false;" --> -
[Blood](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/blood.css'); return false;" --> -
[Night](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/night.css'); return false;" --> -
[Moon](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/moon.css'); return false;" --> -
[Solarized](#)<!-- .element: onclick="document.getElementById('theme').setAttribute('href','css/theme/solarized.css'); return false;" -->

<!--[NOMD/]----->

<!-- .element: data-background="#dddddd" -->

## Slide Backgrounds

Set `data-background="#dddddd"` on a slide to change the background color. All CSS color formats are supported.

<a href="#" class="navigate-down">
    <img width="178" height="238" src="https://s3.amazonaws.com/hakim-static/reveal-js/arrow.png" alt="Down arrow">
</a>

<!--[REMARK/]----->
<!--[REVEAL/]>>>-->

<!-- .element: data-background="https://s3.amazonaws.com/hakim-static/reveal-js/image-placeholder.png" -->

## Image Backgrounds

```html
<section data-background="image.png">
```

<!--[REMARK/]----->
<!--[REVEAL/]>>>-->

<!-- .element: data-background="https://s3.amazonaws.com/hakim-static/reveal-js/image-placeholder.png" data-background-repeat="repeat" data-background-size="100px" -->

## Tiled Backgrounds

```html
<section data-background="image.png" data-background-repeat="repeat" data-background-size="100px">
```
<!-- .element: style="word-wrap: break-word;" -->

<!--[REMARK/]----->
<!--[REVEAL/]>>>-->

<!-- .element: data-background-video="https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.mp4,https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.webm" data-background-color="#000000" -->

<!-- .element: style="background-color: rgba(0, 0, 0, 0.9); color: #fff; padding: 20px;" -->

## Video Backgrounds

```html
<section data-background-video="video.mp4,video.webm">
```
<!-- .element: style="word-wrap: break-word;" -->


<!--[REMARK/]----->
<!--[REVEAL/]>>>-->

<!-- .element: data-background="http://i.giphy.com/90F8aUepslB84.gif" -->

## ... and GIFs!

<!--[NOMD/]----->

<!-- .element: data-transition="slide" data-background="#4d7e65" data-background-transition="zoom" -->

## Background Transitions

Different background transitions are available via the backgroundTransition option. This one's called "zoom".

```js
Reveal.configure({ backgroundTransition: 'zoom' })
```

<!--[NOMD/]----->

<!-- .element: data-transition="slide" data-background="#b5533c" data-background-transition="zoom" -->

## Background Transitions

You can override background transitions per-slide.

```html
<section data-background-transition="zoom">
```

<!--[NOMD/]----->

## Pretty Code

```js
function linkify( selector ) {
  if( supports3DTransforms ) {

    var nodes = document.querySelectorAll( selector );

    for( var i = 0, len = nodes.length; i &lt; len; i++ ) {
      var node = nodes[i];

      if( !node.className ) {
        node.className += ' roll';
      }
    }
  }
}
```

<!-- .element: data-trim contenteditable -->

Code syntax highlighting courtesy of [highlight.js](http://softwaremaniacs.org/soft/highlight/en/description/).

<!--[NOMD/]----->

## Marvelous List

* No order here
* Or here
* Or here
* Or here

<!--[NOMD/]----->

## Fantastic Ordered List

1. One is smaller than...
1. Two is smaller than...
1. Three!

<!--[NOMD/]----->

## Tabular Tables

|Item|Value|Quantity|
|--|--|--|
|Apples|$1|7|
|Lemonade|$2|18|
|Bread|$3|2|

<!--[NOMD/]----->

## Clever Quotes

    <p>
        These guys come in two forms, inline: <q cite="http://searchservervirtualization.techtarget.com/definition/Our-Favorite-Technology-Quotations">The nice thing about standards is that there are so many to choose from</q> and block:
    </p>
    <blockquote cite="http://searchservervirtualization.techtarget.com/definition/Our-Favorite-Technology-Quotations">
        &ldquo;For years there has been a theory that millions of monkeys typing at random on millions of typewriters would
        reproduce the entire works of Shakespeare. The Internet has proven this theory to be untrue.&rdquo;
    </blockquote>

<!--[NOMD/]----->

## Intergalactic Interconnections

You can link between slides internally,
<a href="#/2/3">like this</a>.

<!--[NOMD/]----->

## Speaker View

<p>There's a <a href="https://github.com/hakimel/reveal.js#speaker-notes">speaker view</a>. It includes a timer, preview of the upcoming slide as well as your speaker notes.</p>
<p>Press the <em>S</em> key to try it out.</p>

<aside class="notes">
Oh hey, these are some notes. They'll be hidden in your presentation, but you can see them if you open the speaker notes window (hit 's' on your keyboard).
</aside>

<!--[NOMD/]----->

## Export to PDF

<p>Presentations can be <a href="https://github.com/hakimel/reveal.js#pdf-export">exported to PDF</a>, here's an example:</p>
<iframe data-src="https://www.slideshare.net/slideshow/embed_code/42840540" width="445" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:3px solid #666; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

<!--[NOMD/]----->

## Global State

Set `data-state="something"` on a slide and `"something"`
will be added as a class to the document element when the slide is open. This lets you
apply broader style changes, like switching the page background.

<!--[NOMD/]----->

<!-- .element: data-state="customevent" -->

## State Events

    <p>
        Additionally custom events can be triggered on a per slide basis by binding to the <code>data-state</code> name.
    </p>
    <pre><code class="javascript" data-trim contenteditable style="font-size: 18px;">
Reveal.addEventListener( 'customevent', function() {
console.log( '"customevent" has fired' );
} );
    </code></pre>

<!--[NOMD/]----->

## Take a Moment

Press B or . on your keyboard to pause the presentation. This is helpful when you're on stage and want to take distracting slides off the screen.

<!--[NOMD/]----->

## Much more

    <ul>
        <li>Right-to-left support</li>
        <li><a href="https://github.com/hakimel/reveal.js#api">Extensive JavaScript API</a></li>
        <li><a href="https://github.com/hakimel/reveal.js#auto-sliding">Auto-progression</a></li>
        <li><a href="https://github.com/hakimel/reveal.js#parallax-background">Parallax backgrounds</a></li>
        <li><a href="https://github.com/hakimel/reveal.js#keyboard-bindings">Custom keyboard bindings</a></li>
    </ul>

<!--[NOMD/]----->

<!-- .element: style="text-align: left;" -->

# THE END

- [Try the online editor](https://slides.com)
- [Source code &amp; documentation](https://github.com/hakimel/reveal.js)
