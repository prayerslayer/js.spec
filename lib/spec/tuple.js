import Spec from './spec'
import * as p from '../predicates'
import { dt, valid, specize, explain, getName } from '../util'
import { invalid } from '../symbols'

export class Tuple extends Spec {
  conform(value) {
    const ret = []
    if (p.array(value) && value.length === this.options.specs.length) {
      for (const [i, val] of value.entries()) {
        const conformed = dt(this.options.specs[i], val)
        if (conformed === invalid) {
          return invalid
        }
        ret[i] = conformed
      }
      return ret
    }
    return invalid
  }

  toString() {
    return this.name || `Tuple(${this.options.specs.map(p => getName(p)).join(", ")})`
  }

  explain(path, via, value) {
    if (!p.array(value)) {
      return [{
        path,
        via: [...via, getName(this)],
        value,
        predicate: p.array
      }]
    }
    if (value.length !== this.options.specs.length) {
      return [{
        path,
        via: [...via, getName(this)],
        value,
        predicate: function cardinality(value) {
          value.length === this.options.specs.length
        }
      }]
    }
    return this.options.specs.map((spec, i) => {
      const v = value[i]
      if (!valid(spec, v)) {
        return explain(spec, [...path, i], [...via, getName(this)], v)
      }
      return null
    })
  }
}

export default function tuple(...predicates) {
  if (predicates.length === 0) {
    throw new Error(`Cannot use Tuple spec without predicates`)
  }
  return new Tuple({
    specs: predicates.map(p => specize(p))
  })
}
