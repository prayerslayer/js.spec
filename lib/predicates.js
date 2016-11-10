import set from 'lodash.isset'
import number from 'lodash.isnumber'
import fn from 'lodash.isfunction'
import obj from 'lodash.isplainobject'
import { optional } from './symbols'

// metadata symbols


// primitives
export { default as nil } from 'lodash.isnil'
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
