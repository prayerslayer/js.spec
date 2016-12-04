import { dt, symbolToString } from './util'
import { invalid } from './symbols'
import * as p from './predicates'
// ops
const amp = Symbol()
const rep = Symbol()
const alt = Symbol()
const cat = Symbol()
const acc = Symbol()

function accept(x) {
  return {
    op: acc,
    ret: x
  }
}

function accepted(x) {
  return x.op === acc
}

function nullDeriv(regex, x) {
  const ret = dt(regex, p)
  if (ret !== invalid) {
    return accept(ret)
  }
}

// http://www.ccs.neu.edu/home/turon/re-deriv.pdf
function deriv(regex, x) {
  const {op} = regex

  switch (op) {
    case acc:
      return null
    case null:
      return nullDeriv(regex, x)
    case cat:
      // deriv_regex(r.s) = deriv_regex(r).deriv_regex(s)

    default:
      throw new Error(`Cannot derive unknown operation "${symbolToString(op)}"`)
  }
}

function pcat(ps, ks, ret) {
  // TODO
}

// xy
export function catImpl(predicates) {
  const ks = predicates.map(p => p[0])
  const ps = predicates.map(p => p[1])
  return pcat(ps, ks, {})
}

// (x | y)
export function altImpl() {

}

// x*
export function kleeneImpl() {

}

// x+
export function plusImpl() {

}

// x?
export function maybeImpl() {

}

//????
export function ampImpl() {

}

export function conform(regex, data) {
  const [x, ...xs] = data
  if (p.nil(x)) {
    //TODO nil may be acceptable value
    return invalid
  }
  const derivative = deriv(regex, x)
  if (!p.nil(derivative)) {
    return conform(derivative, xs)
  }
  return invalid
}
