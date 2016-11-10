import Spec from './spec'
import { valid, explain1, dt, specize, getName, cardinality } from '../util'
import * as p from '../predicates'
import { invalid, count, minCount, maxCount } from '../symbols'

export class Collection extends Spec {
  conform(value) {
    if (!p.coll(value)) {
      return invalid
    }

    const card = cardinality(value)
    const countOption = this.options[count]
    const minCountOption = this.options[minCount]
    const maxCountOption = this.options[maxCount]
    if (countOption) {
      if (p.int(countOption) && card !== countOption) {
        return invalid
      }
    } else if (minCountOption || maxCountOption) {
      if (p.int(minCountOption) && minCountOption > card) {
        return invalid
      }
      if (p.int(maxCountOption) && maxCountOption < card) {
        return invalid
      }
    }

    const ret = []
    for (const [key, val] of value.entries()) {
      const conformed = dt(this.options.spec, val)
      if (conformed === invalid) {
        return invalid
      }
      ret[key] = conformed
    }
    return p.array(value) ? ret : new Set(ret)
  }

  toString() {
    return this.name || `Collection(${getName(this.options.spec)})`
  }

  explain(path, via, value) {
    if (!p.coll(value)) {
      return [{
        path,
        via: [...via, getName(this)],
        value,
        predicate: p.coll
      }]
    }
    const card = cardinality(value)
    const countOption = this.options[count]
    const minCountOption = this.options[minCount]
    const maxCountOption = this.options[maxCount]
    if (countOption) {
      if (p.int(countOption) && card !== countOption) {
        return [{
          path,
          via: [...via, getName(this)],
          value,
          predicate: function cardinality(v) {
            return cardinality(v) === countOption
          }
        }]
      }
    } else if (minCountOption || maxCountOption) {
      if (p.int(minCountOption) && minCountOption > card) {
        return [{
          path,
          via: [...via, getName(this)],
          value,
          predicate: function cardinality(v) {
            return cardinality(v) === minCountOption
          }
        }]
      }
      if (p.int(maxCountOption) && maxCountOption < card) {
        return [{
          path,
          via: [...via, getName(this)],
          value,
          predicate: function cardinality(v) {
            return cardinality(v) === maxCountOption
          }
        }]
      }
    }

    return [...value.entries()].map(([key, val]) => {
      if (!valid(this.options.spec, val)) {
        return explain1(this.options.spec, [...path, key], via, val)
      }
      return null
    })
  }
}

export default function collection(spec, opts) {
  if (!spec) {
    throw new Error(`Cannot use Collection spec without predicate.`)
  }
  const params = Object.assign({}, opts)
  params.spec = specize(spec)
  return new Collection(params)
}
