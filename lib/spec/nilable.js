import Spec from './spec'
import * as p from '../predicates'
import { dt, valid, specize, explain, getName } from '../util'
import { invalid } from '../symbols'

export class Nilable extends Spec {
  conform(value) {
    if (p.nil(value)) {
      return value
    } else {
      return dt(this.options.spec, value)
    }
  }

  toString() {
    return this.name || `Nilable(${getName(this.options.spec)})`
  }

  explain(path, via, value) {
    if (!p.nil(value) && !valid(this.options.spec, value)) {
      return explain(this.options.spec, path, [...via, getName(this)], value)
    }
  }
}

export default function nilable(spec) {
  if (!spec) {
    throw new Error(`Cannot use Nilable spec without something to wrap.`)
  }
  return new Nilable({
    spec: specize(spec)
  })
}
