import AbstractSpec from './spec/spec'
import predicateSpec from './spec/predicate'
import { get } from './registry'
import * as p from './predicates'
import { invalid } from './symbols'

/**
 * Takes predicate and value. If predicate is convertable to a spec, conforms
 * value to spec. Else calls predicate.
 *
 * @param  {[type]}  predicate             [description]
 * @param  {[type]}  value                 [description]
 * @param  {String}  [predicateName=""]    [description]
 * @param  {Boolean} [returnBoolean=false] [description]
 * @return {[type]}                        [description]
 */
export function dt(predicate, value, predicateName = "", returnBoolean = false) {
  if (predicate) {
    const spec = toSpec(predicate)
    if (spec) {
      return spec.conform(value)
    }
    if (p.fn(predicate)) {
      if (returnBoolean) {
        return predicate(value)
      }
      return predicate(value) ? value : invalid
    }
    throw new Error(`${predicateName} is not a function, expected predicate`)
  }
  return value
}

export function isSpecInstance(spec) {
  return spec instanceof AbstractSpec
}


export function toSpec(maybeSpec) {
  // check if maybespec is a spec or a symbol in registry
  if (isSpecInstance(maybeSpec)) {
    return maybeSpec
  }
  if (get(maybeSpec)) {
    return get(maybeSpec)
  }
  return null
}

export function specize(spec) {
  if (toSpec(spec)) {
    return toSpec(spec)
  }
  if (p.fn(spec)) {
    return predicateSpec(spec)
  }
  throw new Error(`Cannot coerce ${spec} to spec`)
}

export function valid(spec, value) {
  return spec.conform(value) !== invalid
}

export function explain1(spec, path, via, value) {
  return spec.explain(path, via, value)
}
