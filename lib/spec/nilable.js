import Spec from "./spec";
import * as p from "../predicates";
import {
  dt,
  valid,
  specize,
  explain,
  getName,
  undefinedPredicateWarning
} from "../util";

export class Nilable extends Spec {
  conform(value) {
    if (p.nil(value)) {
      return value;
    } else {
      return dt(this.options.spec, value);
    }
  }

  toString() {
    return this.name || new Nilable(`${this.options.spec.name}`);
  }

  explain(path, via, value) {
    if (!p.nil(value) && !valid(this.options.spec, value)) {
      return explain(this.options.spec, path, [...via, getName(this)], value);
    }
  }
}

export default function nilable(name, spec) {
  if (!p.string(name)) {
    throw new Error(`Name ${name} must be a string.`);
  }
  undefinedPredicateWarning(name, spec);
  return new Nilable(name, {
    spec: specize(spec)
  });
}
