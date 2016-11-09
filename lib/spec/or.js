import Spec from './spec'
import { valid, explain1, dt, specize, getName, cardinality, getAllKeys } from '../util'
import * as p from '../predicates'
import { invalid, count, minCount, maxCount } from '../symbols'

export class Or extends Spec {
  conform(value) {
    for (const [key, spec] of this.options.alternatives) {
      const conformed = dt(spec, value)
      if (conformed !== invalid) {
        return [key, conformed]
      }
    }
    return invalid
  }

  toString() {
    return this.name || `Or(${this.options.alternatives.map(([s]) => getName(s)).join(", ")})`
  }

  explain(path, via, value) {
    if (!valid(this, value)) {
      return this.options.alternatives.map(([key, spec]) => {
        if (!valid(spec, value)) {
          return explain1(spec, path, [...via, getName(this), key], value)
        }
        return null
      })
    }
    return null
  }
}

export default function or(alts) {
  const keys = getAllKeys(alts)
  if (keys.length === 0) {
    throw new Error(`Must provide at least one alternative to Or.`)
  }
  return new Or({
    alternatives: keys.map(k => [k, specize(alts[k])])
  })
}
