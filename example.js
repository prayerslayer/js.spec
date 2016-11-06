import * as spec from './index'

const score = spec.tuple(spec.string, spec.int)
const problems = spec.explain(score, [true, "0"])

console.log(JSON.stringify(problems, null, 2))
/*
// yields
[
  {
    "path": [
      0
    ],
    "via": [
      "Tuple(isString, isInteger)"
    ],
    "value": true,
    "predicateName": "isString"
  },
  {
    "path": [
      1
    ],
    "via": [
      "Tuple(isString, isInteger)"
    ],
    "value": "0",
    "predicateName": "isInteger"
  }
]
 */
