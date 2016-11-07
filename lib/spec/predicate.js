import Spec from './spec'
import { dt, getName } from '../util'
import { invalid } from '../symbols'
/**
 * This is to quickly convert a predicate function into a spec
 */
export class Predicate extends Spec {
  conform(value) {
    const conformed = dt(this.options.fn, value)
    if (conformed === invalid) {
      return invalid
    }
    if (conformed === value) {
      return value
    }
    return conformed
  }

  toString() {
    return this.name || this.options.name
  }

  explain(path, via, value) {
    if (!this.options.fn(value)) {
      return [{
        path,
        via: [...via, getName(this)],
        value,
        predicate: this.options.fn
      }]
    }
    return [null]
  }
}

export default function predicate(predFn) {
  return new Predicate({
    fn: predFn,
    name: getName(predFn)
  })
}
