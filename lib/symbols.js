// returned from conform() if value is invalid according to spec
export const invalid = Symbol("invalid")
// used for map spec, denotes optional keys
export const optional = Symbol("optional")
// used for collection spec
export const count = Symbol("count")
export const minCount = Symbol("minCount")
export const maxCount = Symbol("maxCount")
