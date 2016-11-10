import * as spec from './index'

const point = spec.map({
  x: spec.int,
  y: spec.int
})
const line = spec.map({
  p1: point,
  p2: point
})
const point_or_line = spec.or({
  point,
  line
})

const p = {
  x: 0
}
spec.valid(point_or_line, p)
// => false

// what is wrong?
spec.explain(point_or_line, p)
// value fails spec via Or(point, line), point, Map, Keys(x, y) at [y]: hasKey failed for undefined
// value fails spec via Or(point, line), line, Map, Keys(p1, p2) at [p1]: hasKey failed for undefined
// value fails spec via Or(point, line), line, Map, Keys(p1, p2) at [p2]: hasKey failed for undefined

// let's try again
const p2 = {
  x: 0,
  y: 0
}

spec.valid(point_or_line, p2)
// => true

// but which spec did it match?
spec.conform(point_or_line, p2)
// => [ 'point', { x: 0, y: 0 } ]
