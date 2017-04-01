# js.spec

clojure.spec for Javascript

[![Latest build](https://travis-ci.org/prayerslayer/js.spec.svg?branch=master)](https://travis-ci.org/prayerslayer/js.spec)
[![Coverage Status](https://coveralls.io/repos/github/prayerslayer/js.spec/badge.svg?branch=master)](https://coveralls.io/github/prayerslayer/js.spec?branch=master)
[![npm version](https://badge.fury.io/js/js.spec.svg)](https://badge.fury.io/js/js.spec)

![logo](logo.png)

There is [`clojure.spec`](http://clojure.org/about/spec), a part of Clojure's core library that is intended to help with specification, testing and error messages. I recommend you to read the linked rationale, you will get the gist even without knowledge of Clojure. In any case here's my best attempt of a summary:

In a dynamic language like Javascript or Clojure it is common to represent information with data. For instance, you could encode the score of a soccer match with a list of two integers `[0, 1]`. (In a statically typed language like Java the idiomatic way would be an instance of a `SoccerScore` class.) This data is passed around between modules of your code or sent to external systems, yet the knowledge about what this list of integers stands for is not available anywhere. Maybe you described it in the project's documentation, which is likely outdated. Most probably it is implicitly assumed in your code (`var goals_scored = score[0] + score[1];`). If the semantics change (e.g. list contains also teams), your code breaks.

One way to mitigate this is by static analysis tools ([Flow](https://github.com/facebook/flow)) or typed languages ([Typescript](https://www.typescriptlang.org/)), but they only get you so far. For instance they don't work at runtime (duh!) and offer limited expressiveness. (They also need more tooling, but that's another story.) So what you're left with is manual parsing and checking, which is repetitive and half-assed at worst (`if (!Array.isArray(score)) ...`), and non-standard at best, ie. there is no way for users of your function to know where exactly their provided input failed your specification.

Another issue is that schemas get more popular in the Javascript community (JSON Schema, React.PropTypes...), yet there is no uniform way to define them. Error messages differ from system to system. You can't port your schemas, but need to define them multiple times in different syntax.

`js.spec` tries to solve those problems.

# Usage

For a quick usage example see [example.js](example.js). Otherwise please refer to the documentation.

# Documentation

[http://js-spec.online/](http://js-spec.online/)

# Installation

    npm install js.spec

This will install the current release candidate, as there is no 1.0 yet.

If you want to include it into a web page directly via `script`, please use the [UMD build](dist/js.spec.bundle.js) like this:

~~~ html
<script src="./js.spec.bundle.js" charset="utf-8"></script>
<script type="text/javascript">
  const {spec, valid} = window['js.spec']
  const foo = spec.map({
    name: spec.string
  })
  alert(valid(foo, {name: 'hugo'}))
</script>
~~~

# Implementation Status

The 0.0.x published versions should be seen as developer previews. Code may or may not work. API may or may not witness breaking changes.

* Specs
  * ✅ Primitives
  * ✅ Map
  * ✅ Collection
  * Combination
    * ✅ And
    * ✅ Or
  * ✅ Tuple
  * ✅ Nilable
  * ✅ Enum
* <strike>✅ Spec Registry</strike> Removed after discussion in #21
* :construction: Spec Regexes (`cat`, `alt`, `*`, `?`, `+`)
* 😰 Generator Functions
* 😫 Function Specs (Not even sure if it's possible the way it works in `clojure.spec`)

## Why not use Clojurescript?

If you already thought about using CLJS, go ahead. `clojure.spec` is already available there. However if you meant to pull in CLJS as a dependency: `clojure.spec` is macro-heavy. Macros exist only at compile-time, so all the "functions" (they are macros) are gone.

# License

MIT, see [LICENSE](LICENSE.md)
