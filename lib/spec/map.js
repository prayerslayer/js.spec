import Spec from './spec'
import keys from './keys'
import * as util from '../util'
import * as p from '../predicates'
import { invalid, optional } from '../symbols'

export class Map extends Spec {
  conform(value) {
    if (p.object(value)) {
      const keySpec = keys(...this.options.requiredKeys)
      if (util.valid(keySpec, value)) {
        const ret = {}
        for (const key of Object.keys(value)) {
          const v = value[key]
          const spec = this.options.requiredSpecs[key] || this.options.optionalSpecs[key] || null
          if (spec !== null) {
            const conformed = util.dt(spec, v)
            if (conformed === invalid) {
              return invalid
            }
            ret[key] = conformed
          } else {
            ret[key] = v
          }
        }
        return ret
      }
      return invalid
    }
    return invalid
  }

  explain(value) {}
}

export default function map(shape) {
  const optionalSpecs = shape[optional] || {}
  const optionalKeys = Object.keys(optionalSpecs)
  const requiredSpecs = shape
  const requiredKeys = Object.keys(shape)

  return new Map({
    requiredKeys,
    requiredSpecs,
    optionalKeys,
    optionalSpecs
  })
}
