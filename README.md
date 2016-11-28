# js.spec

[![Latest build](https://travis-ci.org/prayerslayer/js.spec.svg)](https://travis-ci.org/prayerslayer/js.spec)
[![Coverage Status](https://coveralls.io/repos/github/prayerslayer/js.spec/badge.svg?branch=master)](https://coveralls.io/github/prayerslayer/js.spec?branch=master)
[![npm version](https://badge.fury.io/js/js.spec.svg)](https://badge.fury.io/js/js.spec)

clojure.spec for Javascript

# Documentation

[https://prayerslayer.gitbooks.io/js-spec/content/](https://prayerslayer.gitbooks.io/js-spec/content/)

# Installation

    npm install js.spec

For usage examples see [Usage](#usage).

# Implementation Status

The 0.0.x published versions should be seen as developer previews. Code may or may not work. API may or may not witness breaking changes (it will).

* Specs
  * ✅ Primitives
  * ✅ Map
  * ✅ Collection
  * Combination
    * ✅ And
    * ✅ Or
  * ✅ Tuple
  * ✅ Nilable
* ✅ Spec Registry
* :construction: Spec Regexes (`cat`, `alt`, `*`, `?`, `+`)
* 😰 Generator Functions
* 😫 Function Specs (Not even sure if it's possible the way it works in `clojure.spec`)

## Why not use Clojurescript?

If you already thought about using CLJS, go ahead. `clojure.spec` is already available there. However if you meant to pull in CLJS as a dependency: `clojure.spec` is macro-heavy. Macros exist only at compile-time, so all the "functions" (they are macros) are gone.

# License

MIT, see [LICENSE](LICENSE.md)
