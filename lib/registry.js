import {getName, specize} from './util'
import * as p from './predicates'

let REGISTRY = {}

function toSymbol(id) {
  return p.sym(id)
      ? id
      : Symbol.for(id)
};

export function get(id) {
  const k = toSymbol(id)
  const s = REGISTRY[k]

  return p.sym(s)
    ? get(s)
    : s
}

export function define(id, spec) {
  const k = toSymbol(id)

  if (REGISTRY[k]) {
    console.warn(`Overwriting registry entry ${getName(k)}`)
  }

  let s = p.str(spec)
    ? Symbol.for(spec)
    : spec

  if (!p.sym(s)) {
    s = specize(s, false)
    s.name = getName(k)
  }
  REGISTRY[k] = s
}

export function _clear() {
  console.warn(`Removing all specs`)
  REGISTRY = {}
}
