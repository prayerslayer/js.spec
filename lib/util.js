import AbstractSpec from './spec/spec'
import predicateSpec from './spec/predicate'
import { get } from './registry'
import * as p from './predicates'
import { isRegex, regexConform } from './regex'
import { invalid, optional, count, minCount, maxCount } from './symbols'
import flatten from 'lodash.flattendeep'

const EXTRACT_SYMBOL_KEY = /Symbol\((.*?)\)/
export function symbolToString(sym) {
  if (typeof sym === 'symbol') {
    return sym.toString().match(EXTRACT_SYMBOL_KEY)[1]
  }
  return sym
}

/**
 * Takes arrays and returns another array where the first
 * item is the set of first items, the second item is the
 * set of second items etc.
 *
 * [[foo, bar], [1, 2]] <=> [[foo, 1], [bar, 2]]
 *
 * @param  {[type]} colls [description]
 * @return {[type]}       [description]
 */
export function zip(...colls) {
  if (colls.length === 0) {
    return []
  }
  const [c0, ...crest] = colls
  return c0.map((val, i) => [val, ...crest.map(coll => coll[i])])
}

export function getAllKeys(obj) {
  return [
    ...Object.keys(obj), // enumerable keys
    ...Object.getOwnPropertySymbols(obj) // symbol keys
  ].filter(x => [invalid, optional, count, minCount, maxCount].indexOf(x) === -1) // filter own symbols
}

export function cardinality(coll) {
  if (p.array(coll)) {
    return coll.length
  }
  if (p.set(coll)) {
    return coll.size
  }
  return 0
}

export function getName(thing) {
  // if it's a function return function name
  if (p.fn(thing)) {
    return thing.name || '[anonymous predicate]'
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

export function conform(spec, value) {
  try {
    return specize(spec).conform(value)
  } catch (e) {
    // not spec or function
    // is it a regex?
    if (isRegex(spec)) {
      return regexConform(spec, value)
    }
    // nope. throw.
    throw new Error(`${spec.toString()} is not a valid spec.`)
  }
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
    throw new Error(`${getName(predicate)} is a ${typeof predicate}, not a function. Expected predicate`)
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
  return conform(spec, value) !== invalid
}

export function explain1(spec, path, via, value) {
  return spec.explain(path, via, value)
}

export function explainData(spec, value) {
  return flatten((specize(spec)).explain([], [], value))
    .filter(x => !!x)
}
