# mermaid demo

<!--[NOREVEAL/]<span style="font-size:0.7em;">[markdown](?markdown) | [remark](?remark) | [reveal](?reveal)</span>-->
<!--[REVEAL/]<span style="display:block;margin-left:auto;margin-right:auto;font-size:0.6em;width:450px;text-align:center;white-space:pre;">[markdown](?markdown) | [remark](?remark) | [reveal](?reveal)</span>-->
<!--[REVEAL-THEME] beige -->
<!--[REMARK-CONFIG]
{
    "ratio": "16:9"
}
-->

## official site

<https://mermaidjs.github.io/>

## live editor

<https://mermaidjs.github.io/mermaid-live-editor/>


## flowchart source

~~~
```!mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
~~~

## flowchart figure

```!mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

## sequence diagram source

~~~
```!mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
```
~~~

## sequence diagram figure

```!mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
```

## gantt diagram source

~~~
```!mermaid
gantt
        dateFormat  YYYY-MM-DD
        title Adding GANTT diagram functionality to mermaid
        section A section
        Completed task            :done,    des1, 2014-01-06,2014-01-08
        Active task               :active,  des2, 2014-01-09, 3d
        Future task               :         des3, after des2, 5d
        Future task2               :         des4, after des3, 5d
        section Critical tasks
        Completed task in the critical line :crit, done, 2014-01-06,24h
        Implement parser and jison          :crit, done, after des1, 2d
        Create tests for parser             :crit, active, 3d
        Future task in critical line        :crit, 5d
        Create tests for renderer           :2d
        Add to mermaid                      :1d
```
~~~

## gantt diagram figure

```!mermaid
gantt
        dateFormat  YYYY-MM-DD
        title Adding GANTT diagram functionality to mermaid
        section A section
        Completed task            :done,    des1, 2014-01-06,2014-01-08
        Active task               :active,  des2, 2014-01-09, 3d
        Future task               :         des3, after des2, 5d
        Future task2               :         des4, after des3, 5d
        section Critical tasks
        Completed task in the critical line :crit, done, 2014-01-06,24h
        Implement parser and jison          :crit, done, after des1, 2d
        Create tests for parser             :crit, active, 3d
        Future task in critical line        :crit, 5d
        Create tests for renderer           :2d
        Add to mermaid                      :1d
```

## [一覧へ戻る](index.md)
