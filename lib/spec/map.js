import Spec from './spec'
import keys from './keys'
import { valid, explain1, dt, specize, getName, getAllKeys } from '../util'
import * as p from '../predicates'
import { invalid, optional } from '../symbols'

export class Map extends Spec {
  conform(value) {
    if (p.object(value)) {
      const keySpec = keys(...this.options.requiredKeys)
      if (valid(keySpec, value)) {
        const ret = {}
        for (const key of getAllKeys(value)) {
          const v = value[key]
          const spec = this.options.requiredSpecs[key] || this.options.optionalSpecs[key] || null
          if (spec !== null) {
            const conformed = dt(spec, v)
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

  toString() {
    return this.name || `Map`
  }

  explain(path, via, value) {
    const ks = keys(...this.options.requiredKeys)
    if (!valid(ks, value)) {
      return explain1(ks, path, [...via, getName(this)], value)
    }
    return getAllKeys(value).map(key => {
      const v = value[key]
      const spec = specize(this.options.requiredSpecs[key] || this.options.optionalSpecs[key] || null)
      if (!valid(spec, v)) {
        return explain1(spec, [...path, key], [...via, getName(this)], value)
      }
      return null
    })
  }
}

export default function map(shape) {
  const optionalSpecs = shape[optional] || {}
  const optionalKeys = getAllKeys(optionalSpecs)
  const requiredSpecs = shape
  const requiredKeys = getAllKeys(shape)

  return new Map({
    requiredKeys,
    requiredSpecs,
    optionalKeys,
    optionalSpecs
  })
}
