import array from 'lodash.isarray'
import set from 'lodash.isset'
import number from 'lodash.isnumber'
import nil from 'lodash.isnil'

// primitives
export { default as number } from 'lodash.isnumber'
export { default as fn } from 'lodash.isfunction'
export { default as bool, default as boolean } from 'lodash.isboolean'
export { default as date } from 'lodash.isdate'
export { default as int, default as integer } from 'lodash.isinteger'
export { default as str, default as string } from 'lodash.isstring'
export { default as sym, default as symbol } from 'lodash.issymbol'
export { default as finite } from 'lodash.isfinite'
export { default as array } from 'lodash.isarray'
export { default as set } from 'lodash.isset'

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
