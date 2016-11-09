import * as spec from './index'

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
// value fails spec via Or(2d, 3d), 2d, Map, Keys(x, y) at [y]: hasKey failed for undefined
// value fails spec via Or(2d, 3d), 3d, Map, Keys(x, y, z) at [y]: hasKey failed for undefined
// value fails spec via Or(2d, 3d), 3d, Map, Keys(x, y, z) at [z]: hasKey failed for undefined

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
