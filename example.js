import * as spec from './index'

const score = Symbol("Score")
spec.define(score, spec.tuple(spec.string, spec.int))
spec.explain(score, [true, "0"])
// => value fails spec Score at [0]: isString failed for true
// => value fails spec Score at [1]: isInteger failed for 0

spec.valid(score, ["barbara", 0])
// => true
