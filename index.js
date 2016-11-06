import * as util from './lib/util'
import * as specs from './lib/spec'
import * as predicates from './lib/predicates'
import getIn from 'lodash.get'

export * from './lib/spec'
export * from './lib/predicates'
export * from './lib/symbols'
export * from './lib/registry'
export { valid } from './lib/util'

export function conform(spec, value) {
  return (util.specize(spec)).conform(value)
}

export function explain(spec, value) {
  const problems = (util.specize(spec)).explain([], [], value).filter(x => !!x)
  problems.forEach(problem => {
    console.log(`value fails spec ${problem.via[0]} at [${problem.path.join(", ")}]: ${problem.predicateName} failed for ${getIn(value, problem.path)}`)
  })
}
