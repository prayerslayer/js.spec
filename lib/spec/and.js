import Spec from './spec'
import { valid, explain1, dt, specize, getName, cardinality } from '../util'
import * as p from '../predicates'
import { invalid, count, minCount, maxCount } from '../symbols'

export class And extends Spec {
  conform(value) {
    let ret = value
    for (const spec of this.options.specs) {
      const conformed = dt(spec, ret)
      if (conformed === invalid) {
        return invalid
      }
      ret = value
    }
    return ret
  }

  toString() {
    return this.name || `And(${this.options.specs.map(s => getName(s)).join(", ")})`
  }

  explain(path, via, value) {
    let ret = value
    for (const spec of this.options.specs) {
      if (!valid(spec, value)) {
        return explain1(spec, path, [...via, getName(this)], value)
      }
    }
    return null
  }
}

export default function and(...preds) {
  if (preds.length === 0) {
    throw new Error(`Cannot use And spec without predicates.`)
  }
  return new And({
    specs: preds.map(p => specize(p))
  })
}
