import Spec from './spec'
import * as p from '../predicates'
import { dt, valid, specize, explain1, getName } from '../util'
import { invalid } from '../symbols'

export class Tuple extends Spec {
  conform(value) {
    const ret = []
    if (p.array(value) && value.length === this.options.predicates.length) {
      for (let i = 0; i < value.length; i++) {
        const conformed = dt(this.options.predicates[i], value[i], this.options.predicateNames[i])
        if (conformed === invalid) {
          return invalid
        }
        if (conformed === value[i]) {
          ret.push(value[i])
        } else {
          ret.push(conformed)
        }
      }
      return ret
    }
    return invalid
  }

  toString() {
    return this.name || `Tuple(${this.options.predicateNames.join(", ")})`
  }

  explain(path, via, value) {
    if (!p.array(value)) {
      return [{
        path,
        via,
        value,
        predicateName: getName(p.array),
        predicate: p.array
      }]
    }
    if (value.length !== this.options.predicates.length) {
      return [{
        path,
        via,
        value,
        predicateName: `equals ${this.options.predicates.length}`,
        predicate: (value) => value.length === this.options.predicates.length
      }]
    }
    return this.options.predicates
      .map((predicate, i) => {
        const v = value[i]
        const s = specize(predicate)
        if (!valid(s, v)) {
          return explain1(s, [...path, i], [...via, getName(this)], v)
        }
        return null
      })
      .reduce((problems, problem) => {
        if (p.array(problem)) {
          return [...problems, ...problem]
        } else {
          return [...problems, problem]
        }
      }, [])
  }
}

export default function tuple(...predicates) {
  return new Tuple({
    predicates,
    predicateNames: predicates.map(p => getName(p))
  })
}
