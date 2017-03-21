import Spec from './spec'
import { valid, explain, dt, specize, getName } from '../util'
import { invalid } from '../symbols'

export class And extends Spec {
  conform(value) {
    let ret = value
    for (const spec of this.options.specs) {
      const conformed = dt(spec, ret)
      if (conformed === invalid) {
        return invalid
      }
      ret = conformed
    }
    return ret
  }

  toString() {
    return this.name || `And(${this.options.specs.map(s => getName(s)).join(", ")})`
  }

  explain(path, via, value) {
    for (const spec of this.options.specs) {
      const s = specize(spec)
      if (!valid(s, value)) {
        return explain(s, path, [...via, getName(this)], value)
      }
    }
    return null
  }
}

export default function and(...specs) {
  if (specs.length === 0) {
    throw new Error(`Cannot use And spec without predicates.`)
  }
  return new And({
    specs
  })
}
