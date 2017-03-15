import { getName } from './util'
let REGISTRY = {}

export function get(id) {
  const s = REGISTRY[id]
  if (typeof s !== 'symbol') {
    return s
  }
  return get(s)
}

export function define(id, spec) {
  if (typeof id !== "symbol") {
    console.warn(`Spec ID ${id} is not a Symbol. You should use Symbols to avoid ambiguity.`)
  }
  if (get(id)) {
    console.warn(`Overwriting spec ${getName(id)}`)
  }
  spec.name = getName(id)
  REGISTRY[id] = spec
}

export function _clear() {
  console.warn("Removing all specs")
  REGISTRY = {}
}
