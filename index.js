import * as util from './lib/util'
import * as specs from './lib/spec'
import * as predicates from './lib/predicates'
import getIn from 'lodash.get'

const specsAndPreds = Object.assign({}, specs, predicates)

export { specsAndPreds as spec }

export * from './lib/symbols'
export * from './lib/registry'
export { valid } from './lib/util'

export function conform(spec, value) {
  return (util.specize(spec)).conform(value)
}

export function explainData(spec, value) {
  return util.explainData(spec, value)
    .map(problem => {
      problem.predicateName = util.getName(problem.predicate)
      return problem
    })
}

export function explain(spec, value) {
  explainData(spec, value)
    .forEach(problem => console.log(`${problem.via.join(" -> ")}: ${problem.predicateName} failed for ${getIn(value, problem.path)} at [${problem.path.join(", ")}].`))
}
