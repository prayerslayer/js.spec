import Spec from './spec'
import { valid, explain1, dt, specize, getName, cardinality } from '../util'
import * as p from '../predicates'
import { invalid, count, minCount, maxCount } from '../symbols'

export class Or extends Spec {
  conform(value) {
    for (const spec of this.options.specs) {
      const conformed = dt(spec, value)
      if (conformed !== invalid) {
        return conformed
      }
    }
    return invalid
  }

  toString() {
    return this.name || `Or(${this.options.specs.map(s => getName(s)).join(", ")})`
  }

  explain(path, via, value) {
    if (!valid(this, value)) {
      return this.options.specs.map(spec => {
        if (!valid(spec, value)) {
          return explain1(spec, path, [...via, getName(this)], value)
        }
        return null
      })
    }
    return null
  }
}

export default function or(...preds) {
  if (preds.length === 0) {
    throw new Error(`Cannot use Or spec without predicates.`)
  }
  return new Or({
    specs: preds.map(p => specize(p))
  })
}
