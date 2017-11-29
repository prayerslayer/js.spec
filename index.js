import * as util from "./lib/util";
import * as specs from "./lib/spec";
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

export function explainData(spec, value) {
  const problems = flatten(util.explain(spec, [], [], value)).filter(x => !!x);
  return problems.map(problem => {
    problem.predicateName = util.getName(problem.predicate);
    return problem;
  });
}

function problemStr(problem, value) {
  let str = `${problem.via.join(
    " → "
  )}: ${problem.predicateName} failed for ${get(value, problem.path, value)}`;
  if (problem.path.length > 0) {
    str += ` at [${problem.path.join(", ")}]`;
  }
  return str + ".";
}

export function explain(spec, value) {
  explainData(spec, value).forEach(
    problem => console.log(problemStr(problem, value)) // eslint-disable-line
  );
}

export function explainStr(spec, value) {
  return explainData(spec, value)
    .map(problem => problemStr(problem, value))
    .join("\n");
}

export function assert(spec, value) {
  if (!util.valid(spec, value)) {
    throw new Error(explainStr(spec, value));
  }
}
