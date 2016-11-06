import { get } from './lib/registry'
import * as util from './lib/util'
import * as specs from './lib/spec'
import * as predicates from './lib/predicates'
import _get from 'lodash.get'

export * from './lib/spec'
export * from './lib/predicates'
export * from './lib/symbols'

export function conform(spec, value) {
  return (util.specize(spec)).conform(value)
}

export function explain(spec, value) {
  const problems = (util.specize(spec)).explain([], [], value).filter(x => !!x)
  problems.forEach(problem => {
    console.log(`value fails spec ${problem.via[0]} at [${problem.path.join(", ")}]: ${problem.predicateName} failed for ${_get(value, problem.path)}`)
  })
}
