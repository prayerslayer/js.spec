import * as util from './lib/util'
import * as specs from './lib/spec'
import { catImpl as cat, altImpl as alt } from './lib/regex'
import * as predicates from './lib/predicates'
import * as symbols from './lib/symbols'
import getIn from 'lodash.get'
import flatten from 'lodash.flattendeep'

const specsAndPreds = Object.assign({
  cat,
  alt
}, specs, predicates)

export { specsAndPreds as spec, symbols as symbol }
export * from './lib/registry'
export { valid, conform } from './lib/util'

export function explainData(spec, value) {
  const problems = flatten(util.explain(spec, [], [], value)).filter(x => !!x)
  return problems.map(problem => {
    problem.predicateName = util.getName(problem.predicate)
    return problem
  })
}

export function explain(spec, value) {
  explainData(spec, value)
    .forEach(problem => console.log(`${problem.via.join(" → ")}: ${problem.predicateName} failed for ${getIn(value, problem.path)} at [${problem.path.join(", ")}].`))
}
