# js.spec

[![Latest build](https://travis-ci.org/prayerslayer/js.spec.svg)](https://travis-ci.org/prayerslayer/js.spec)
[![Coverage Status](https://coveralls.io/repos/github/prayerslayer/js.spec/badge.svg?branch=master)](https://coveralls.io/github/prayerslayer/js.spec?branch=master)

clojure.spec for Javascript

# Rationale

So there is [`clojure.spec`](http://clojure.org/about/spec), a part of Clojure's core library that is intended to help with specification, testing and error messages. I really urge you to read the linked rationale, you will get the gist even without knowledge of Clojure. In any case here's my best attempt of a summary:

In a dynamic language like Javascript or Clojure it's common to represent information with data. For instance, the score of a soccer match could be encoded in a list of two integers `[0, 1]`. (Whereas in a static language like Java you would do this with an instance of a `SoccerScore` class with `home` and `away` members.) This information is passed around between modules of your code or sent to external systems, yet the knowledge about what this list of integers stands for is not available anywhere. It's maybe in your likely outdated documentation, but mostly it is implicitly assumed in your code (`var goals_scored = score[0] + score[1];`). If the meaning changes, your code breaks.

One way to mitigate this is by static analysis tools ([Flow](https://github.com/facebook/flow)) or typed languages ([Typescript](https://www.typescriptlang.org/)), but they only get you so far. For instance they don't work at runtime (duh!) and offer limited expressiveness. (They also require additional tooling, but that's another topic.) So what you're left with is manual parsing and checking, but that is repetitive and half-assed at worst (`if (!Array.isArray(score)) ...`), and non-standard at best, ie. there is no way for users of your function to know where exactly their provided input failed your specification.

`js.spec` tries to solve those problems.

# Implementation Status

* Specs
  * ✅ Map
  * ✅ Collection
  * Combination
    * ✅ And
    * ✅ Or
  * ✅ Tuple
* ✅ Spec Registry
* 😓 Spec Regexes (`cat`, `alt`, `*`, `?`, `+`)
* 😰 Generator Functions
* 😫 Function Specs (Not even sure if it's possible the way it works in `clojure.spec`)

## Why not use Clojurescript?

If you already thought about using CLJS, go ahead. `clojure.spec` is already available there. However if you meant to pull in CLJS as a dependency: `clojure.spec` is macro-heavy. Macros exist only at compile-time, so all the "functions" (they are macros) are gone.

# Usage Example

**ATTENTION** API is definitely going to change. Currently I just export everything.

~~~ javascript
import * as spec from 'js.spec'

const point_2d = spec.map({
  x: spec.int,
  y: spec.int
})
const point_maybe_3d = spec.map({
  x: spec.int,
  y: spec.int,
  [spec.optional]: {
    z: spec.int
  }
})
const point = spec.or({
  "2d": point_2d,
  "3d-ish": point_maybe_3d
})

const p = {
  x: 0
}
spec.valid(point, p)
// => false

// what is wrong?
spec.explain(point, p)
// value fails spec via Or(2d, 3d-ish), 2d, Map, Keys(x, y) at [y]: hasKey failed for undefined
// value fails spec via Or(2d, 3d-ish), 3d-ish, Map, Keys(x, y) at [y]: hasKey failed for undefined


// let's try again
const p2 = {
  x: 0,
  y: 0
}

spec.valid(point, p2)
// => true

// but which point spec did it match?
spec.conform(point, p2)
// => [ '2d', { x: 0, y: 0 } ]
~~~

# License

MIT, see [LICENSE](LICENSE.md)
