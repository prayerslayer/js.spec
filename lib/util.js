import AbstractSpec from './spec/spec'
import predicateSpec from './spec/predicate'
import { get } from './registry'
import * as p from './predicates'
import { invalid } from './symbols'
import flatten from 'lodash.flattendeep'

const EXTRACT_SYMBOL_KEY = /Symbol\((.*?)\)/
export function symbolToString(sym) {
  if (typeof sym === 'symbol') {
    return sym.toString().match(EXTRACT_SYMBOL_KEY)[1]
  }
  return sym
}

export function getName(thing) {
  // if it's a function return function name
  if (p.fn(thing)) {
    return thing.name
  }
  // if it's a spec call toString() implementation
  if (isSpecInstance(thing)) {
    return thing.toString()
  }
  // if it's a symbol convert it to string
  if (p.symbol(thing)) {
    return symbolToString(thing)
  }
  return thing.toString()
}

/**
 * Takes predicate and value. If predicate is convertable to a spec, conforms
 * value to spec. Else calls predicate.
 *
 * @param  {[type]}  predicate             [description]
 * @param  {[type]}  value                 [description]
 * @param  {Boolean} [returnBoolean=false] [description]
 * @return {[type]}                        [description]
 */
export function dt(predicate, value, returnBoolean = false) {
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
    throw new Error(`${getName(predicate)} is not a function, expected predicate`)
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
  throw new Error(`Cannot coerce ${getName(spec)} to spec`)
}

export function valid(spec, value) {
  return (specize(spec)).conform(value) !== invalid
}

export function explain1(spec, path, via, value) {
  return spec.explain(path, via, value)
}

export function explainData(spec, value) {
  return flatten((specize(spec)).explain([], [], value))
    .filter(x => !!x)
}
