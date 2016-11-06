# js.spec

![Latest build](https://travis-ci.org/prayerslayer/js.spec.svg)
[![Coverage Status](https://coveralls.io/repos/github/prayerslayer/js.spec/badge.svg?branch=master)](https://coveralls.io/github/prayerslayer/js.spec?branch=master)

clojure.spec for Javascript

This is the second part of the READMe. First part will be added as soon as I can log into the other computer again.

# MVP Roadmap & Status

1. <strike>Predicates</strike>
1. Specs
  * <strike>Tuple</strike>
  * <strike>Map</strike>
  * Collection
  * And, Or
  * Function
1. <strike>Spec Registry</strike>
1. Sequences
1. Generators

# Usage

** ATTENTION MAY CHANGE **

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
