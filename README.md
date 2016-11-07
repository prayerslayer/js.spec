# js.spec

[![Latest build](https://travis-ci.org/prayerslayer/js.spec.svg)](https://travis-ci.org/prayerslayer/js.spec)
[![Coverage Status](https://coveralls.io/repos/github/prayerslayer/js.spec/badge.svg?branch=master)](https://coveralls.io/github/prayerslayer/js.spec?branch=master)

clojure.spec for Javascript

# MVP Roadmap & Status

1. <strike>Predicates</strike>
1. Specs
  * <strike>Tuple</strike>
  * <strike>Map</strike>
  * <strike>Collection</strike>
  * And, Or
  * Function
1. <strike>Spec Registry</strike>
1. Sequences
1. Generators

# Rationale

You want to make sure that data you are about to process conforms to what you expect it to be. Consider a function `fibonacci`, in the simplest case. It can only work on a positive number.

    fibonacci(10)
    => 55
    fibonacci(-5)
    => ???
    fibonacci("five")
    => ???????
    fibonacci({ isRecursionExercise: false })
    => "please stop"

There are currently three ways to do make sure your function is only called with certain parameters. If none of these are appealing for your project, `js.spec` is for you.

## DIY

~~~ javascript
function fibonacci(pos) {
  if (typeof pos !== "number") {
    throw new Error("what are you doing")
  }
  //...
}
~~~

This gets repetitive when you have many functions working on the same data.

## Static analysis tools

Like [Flow](https://flowtype.org/).

~~~ javascript
// @flow
function fibonacci(x): number {
  //...
}
~~~

It can infer some stuff without annotations, but once you add type annotations you also need a babel plugin to transform it to valid Javascript.

## Typescript

This is not Javascript anymore.

# Examples

**TODO**

* Sharing knowledge about domain objects between client and server
* Other :grin:

# Usage

**ATTENTION: WILL CHANGE, DOES NOT REPRESENT CURRENT STATE** I just wrote this to get a feeling for the API.

## Predicates

~~~ javascript
import spec, {predicates as p} from 'js-spec'

spec.conform(p.even, 10)
// => 10

spec.valid(p.even, 10)
// => true

spec.valid(p.null, null) // => true
spec.valid(p.string, "abc") // => true
spec.valid(x => x % 5 === 0, 10) // => true
spec.valid(x => x % 5 === 0, 7) // => false
spec.valid(new Set(["club", "diamond", "heart", "spade"]), "club") // => true
spec.valid(new Set(["club", "diamond", "heart", "spade"]), 42) // => false
~~~

## Registry

~~~ javascript
import spec from 'js-spec'

const SUIT = Symbol("SUIT")

spec.define(SUIT, new Set(["club", "diamond", "heart", "spade"]))

spec.valid(SUIT, "club") // => true
spec.conform(SUIT, "club") // => "club"
~~~

## Composition

~~~ javascript
import spec, { predicates as p } from 'js-spec'

const BIG_EVEN  = Symbol("BIG_EVEN")

spec.define(BIG_EVEN, p.and(p.int, p.even, x => x > 1000))
spec.valid(BIG_EVEN, "foo") // => false
spec.valid(BIG_EVEN, 10) // => false
spec.valid(BIG_EVEN, 100000) // => true

const NAME_OR_ID = Symbol("NAME_OR_ID")

spec.define(NAME_OR_ID, p.or({
  name: p.string,
  id: p.int
}))
spec.valid(NAME_OR_ID, "abc") // => true
spec.valid(NAME_OR_ID, 100) // => true
spec.valid(NAME_OR_ID, false) // => false

spec.conform(NAME_OR_ID, "abc") // => {name: "abc"}
~~~

## Nullables

~~~ javascript
import spec, { predicates as p } from 'js-spec'

spec.valid(p.string, null) // => false
spec.valid(p.nullable(p.string), null) // => true
~~~

## Explain

~~~ javascript
import spec from 'js-spec'

spec.explain(SUIT, 42)
/*
{
  value: 42,
  valid: false,
  spec: SUIT,
  predicate: function()...
}
*/
~~~

## Entity maps

~~~ javascript
import spec, { predicates as p } from 'js-spec'

const EMAIL = Symbol("EMAIL")
const ACCOUNT_ID = Symbol("ACCOUNT_ID")
const FIRST_NAME = Symbol("FIRST_NAME")
const LAST_NAME = Symbol("LAST_NAME")
const PHONE = Symbol("PHONE")
const PERSON = Symbol("PERSON")

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/

spec.define(PHONE, p.and(p.string, x => /^+?[0-9]+/))
spec.define(EMAIL, p.and(p.string, x => emailRegex.test(x)))
spec.define(FIRST_NAME, p.string)
spec.define(LAST_NAME, p.string)
spec.define(PERSON, {
  email: EMAIL,
  firstName: FIRST_NAME,
  lastName: LAST_NAME,
  [p.optionalKeys]: {
    phoneNumber: PHONE
  }
}

const ANIMAL_KIND = Symbol("ANIMAL_KIND")
const ANIMAL_SAYS = Symbol("ANIMAL_SAYS")
const ANIMAL_COMMON = Symbol("ANIMAL_COMMON")
const DOG_TAIL = Symbol("DOG_TAIL")
const DOG_BREED = Symbol("DOG_BREED")
const ANIMAL_DOG = Symbol("ANIMAL_DOG")

spec.define(ANIMAL_KIND, p.string)
spec.define(ANIMAL_SAYS, p.string)
// note the difference between symbol and string keys
spec.define(ANIMAL_COMMON, p.keys({
  "animal_kind": ANIMAL_KIND,
  ANIMAL_SAYS
}))
spec.define(DOG_TAIL, p.boolean)
spec.define(DOG_BREED, p.string)
spec.define(ANIMAL_DOG, p.merge(ANIMAL_COMMON, p.keys({DOG_TAIL, DOG_BREED})))

spec.valid(ANIMAL_DOG, {
  animal_kind: "dog",
  [ANIMAL_SAYS]: "woof",
  [DOG_TAIL]: true,
  [DOG_BREED]: "retriever"
})
// => true
~~~

## Collections

~~~ javascript
import spec, { predicates as p} from 'js-spec'

spec.conform(p.collOf(p.int), [1, 2, 3, 4])
// => [1, 2, 3, 4]
spec.conform(p.collOf(p.string), new Set(["foo", "bar"]))
// => Set { 'foo', 'bar' }

spec.valid(p.collOf(p.string, { [p.count]: 2 }), ["one"])
// => false

// accepted options for collOf
// [p.length]: exact size,
// [p.minLength],
// [p.maxLength],
// [p.distinct]
~~~

~~~ javascript
import spec, { predicates as p} from 'js-spec'

const POINT = Symbol()
spec.define(POINT, p.tuple(p.double, p.double, p.double))
spec.valid(POINT, [1.5, 2.5, -0.5])
// => true
~~~

~~~ javascript
import spec, { predicates as p} from 'js-spec'

const SCORES = Symbol()
spec.define(SCORES, p.mapOf(p.string, p.int)
spec.valid(SCORES, {
  harry: 10,
  sally: 5
})
// => true
~~~
