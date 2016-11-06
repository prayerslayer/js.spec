let REGISTRY = {}

export function get(spec) {
  const s = REGISTRY[spec]
  if (typeof s !== 'symbol') {
    return s
  }
  return get(s)
}
