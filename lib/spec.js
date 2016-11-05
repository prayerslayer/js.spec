import * as p from './predicates'

const SPEC_REGISTRY = {}

export function conform(spec, data) {
  return valid(spec, data) ? data : null
}

export function valid(spec, data) {
  if (p.fn(spec)) {
    return spec(data)
  }
  if (SPEC_REGISTRY[spec]) {
    return SPEC_REGISTRY[spec](data)
  }
  throw new Error(`Unknown spec ${spec.toString()}`)
}

export function explain(spec, data) {
  throw new Error("Not yet implemented")
}

export function define(specId, spec) {
  if (SPEC_REGISTRY[specId]) {
    console.warn(`${specId} already exists, will overwrite.`)
  }
  SPEC_REGISTRY[specId] = spec
  return spec
}

export function _undefineAll() {
  Object.keys(SPEC_REGISTRY).forEach(key => {
    SPEC_REGISTRY[key] = null
  })
}
