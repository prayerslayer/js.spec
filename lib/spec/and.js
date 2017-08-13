import Spec from "./spec";
import * as p from "../predicates";
import {
  valid,
  explain,
  dt,
  specize,
  getName,
  undefinedPredicateWarning
} from "../util";
import { invalid } from "../symbols";

export class And extends Spec {
  conform(value) {
    let ret = value;
    for (const spec of this.options.specs) {
      const conformed = dt(spec, ret);
      if (conformed === invalid) {
        return invalid;
      }
      ret = conformed;
    }
    return ret;
  }

  toString() {
    return this.name || `And`;
  }

  explain(path, via, value) {
    for (const spec of this.options.specs) {
      const s = specize(spec);
      if (!valid(s, value)) {
        return explain(s, path, [...via, getName(this)], value);
      }
    }
    return null;
  }
}

export default function and(name, ...specs) {
  if (!p.string(name)) {
    throw new Error(`Name ${name.toString()} must be a string.`);
  }
  if (specs.length === 0) {
    throw new Error(`Cannot use And spec without predicates.`);
  }
  undefinedPredicateWarning(name, specs);
  return new And(name, { specs });
}
