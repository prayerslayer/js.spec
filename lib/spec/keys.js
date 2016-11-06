import Spec from './spec'
import * as util from '../util'
import * as p from '../predicates'
import { invalid, optional } from '../symbols'

export class Keys extends Spec {
  conform(value) {
    if (p.object(value)) {
      for (const key of this.options.requiredKeys) {
        if (!value.hasOwnProperty(key)) {
          return invalid
        }
      }
      return value
    }
    return invalid
  }

  toString() {
    return this.name || `Keys(${this.options.requiredKeys.join(", ")})`
  }
}

export default function keys(...requiredKeys) {
  return new Keys({
    requiredKeys
  })
}
