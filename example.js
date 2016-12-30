import { spec, valid, explain, conform } from './index'

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
valid(point_or_line, p)
// => false

// what is wrong?
explain(point_or_line, p)
// Or(point, line) → point → Map → Keys(x, y): hasKey failed for undefined at [y].
// Or(point, line) → line → Map → Keys(p1, p2): hasKey failed for undefined at [p1].
// Or(point, line) → line → Map → Keys(p1, p2): hasKey failed for undefined at [p2].

// let's try again
const p2 = {
  x: 0,
  y: 0
}

valid(point_or_line, p2)
// => true

// but which spec did it match?
conform(point_or_line, p2)
// => [ 'point', { x: 0, y: 0 } ]

// regexes work also (only cat/alt currently though)
const line2 = spec.cat("source", point, "target", point)
conform(line2, [p2, p2])
// => {source: {x: 0, y: 0}, target: {x: 0, y: 0}}
explain(line2, [p2, p])
// cat · → target → Map → Keys(x, y): hasKey failed for undefined at [1, y]
explain(line2, [p2])
// cat · → target → Map: isObject failed for undefined at [1].
