import * as util from "./lib/util";
import * as specs from "./lib/spec";
import Spec from "./lib/spec/spec";
import { catImpl as cat, altImpl as alt } from "./lib/regex";
import * as predicates from "./lib/predicates";
import * as symbols from "./lib/symbols";
import get from "lodash.get";
import flatten from "lodash.flattendeep";

const specsAndPreds = Object.assign(
  {
    cat,
    alt
  },
  specs,
  predicates
);

export { specsAndPreds as spec, symbols as symbol };
export { valid, conform } from "./lib/util";
export { Spec as AbstractSpec };

export function explainData(spec, value) {
  const problems = flatten(util.explain(spec, [], [], value)).filter(x => !!x);
  return problems.map(problem => {
    problem.predicateName = util.getName(problem.predicate);
    return problem;
  });
}

export function problemStr(problem) {
  let str = `${problem.via.join(" → ")}: ${
    problem.predicateName
  } failed for ${JSON.stringify(
    get(problem.value, problem.path, problem.value)
  )}`;
  if (problem.path.length > 0) {
    str += ` at [${problem.path.join(", ")}]`;
  }
  return str + ".";
}

export function explain(spec, value) {
  explainData(spec, value).forEach(problem => console.log(problemStr(problem))); // eslint-disable-line no-console
}

export function explainStr(spec, value) {
  return explainData(spec, value)
    .map(problem => problemStr(problem))
    .join("\n");
}

export function assert(spec, value) {
  if (!util.valid(spec, value)) {
    throw new Error(explainStr(spec, value));
  }
}
