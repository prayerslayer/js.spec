import set from 'lodash.isset'
import number from 'lodash.isnumber'
import nil from 'lodash.isnil'
import fn from 'lodash.isfunction'
import obj from 'lodash.isplainobject'
import { optional } from './symbols'

// metadata symbols


// primitives
export { default as number } from 'lodash.isnumber'
export { default as fn } from 'lodash.isfunction'
export { default as bool, default as boolean } from 'lodash.isboolean'
export { default as date } from 'lodash.isdate'
export { default as int, default as integer } from 'lodash.isinteger'
export { default as str, default as string } from 'lodash.isstring'
export { default as sym, default as symbol } from 'lodash.issymbol'
export { default as finite } from 'lodash.isfinite'
export { default as set } from 'lodash.isset'
export { default as obj, default as object } from 'lodash.isplainobject'
export const array = Array.isArray

// predicates for collections
export function coll(maybeCollection) {
  return array(maybeCollection) || set(maybeCollection)
}

// convenience predicates on primitives

export function even(nr) {
  return number(nr) && nr % 2 === 0
}

export function odd(nr) {
  return number(nr) && !even(nr)
}

export function positive(nr) {
  return number(nr) && nr > 0
}

export function negative(nr) {
  return number(nr) && nr < 0
}

export function zero(nr) {
  return nr === 0
}

// meta-predicates
function cardinality(coll) {
  if (array(coll)) {
    return coll.length
  }
  if (set(coll)) {
    return coll.size
  }
  return 0
}

export function nilable(pred) {
  return (data) => nil(data) || pred(data)
}



// ==== TODO REMOVE =====

export function keys(...requiredKeys) {
  return (data) => {
    for (const key of requiredKeys) {
      if (!data.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }
}


export function and(...predicates) {
  const identity = true
  if (zero(cardinality(predicates))) {
    return () => identity
  }
  return (data) => {
    let result = identity
    for (const pred of predicates) {
      result = result && pred(data)
      if (result === false) {
        return false
      }
    }
    return true
  }
}

export function or(...predicates) {
  const identity = false
  if (zero(cardinality(predicates))) {
    return () => identity
  }
  return (data) => {
    let result = identity
    for (const pred of predicates) {
      result = result || pred(data)
      if (result === true) {
        return true
      }
    }
    return false
  }
}

// TODO naming
export function record(shape) {
  // shape is an object where values are predicates
  return (data) => {
    const flatShape = Object.assign({}, shape, shape[optional])
    const allKeys = Object.keys(flatShape || {})
    const optionalKeys = Object.keys(flatShape[optional] || {})

    for (const key of Object.keys(flatShape)) {
      if (key === optional) {
        continue;
      }
      const isKeyDesired = allKeys.indexOf(key) !== -1
      const isKeyOptional = optionalKeys.indexOf(key) !== -1
      const isKeyPresent = data.hasOwnProperty(key)
      let isKeyConform = true

      // if key is optional, it must either be present and conform, or omitted
      if (isKeyOptional && !isKeyPresent) {
        isKeyConform = true
      } else if (isKeyOptional && isKeyPresent) {
        isKeyConform = flatShape[key](data[key])
      } else if (isKeyDesired) {
        // it's not optional, but we want it => it's required
        // if key is required, it must be present and conform to predicate
        isKeyConform = isKeyPresent && flatShape[key](data[key])
      }
      // if key is neither, we do not care

      // exit as soon as possible
      if (!isKeyConform) {
        return false
      }
    }
    return true
  }
}
