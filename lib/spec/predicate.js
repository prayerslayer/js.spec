import Spec from "./spec";
import { dt, getName } from "../util";
import { invalid } from "../symbols";
/**
 * This is to quickly convert a predicate function into a spec
 */
export class Predicate extends Spec {
  conform(value) {
    const conformed = dt(this.options.fn, value);
    if (conformed === invalid) {
      return invalid;
    }
    return conformed;
  }

  toString() {
    return this.name || this.options.name;
  }

  explain(path, via, value) {
    if (!this.options.fn(value)) {
      return [
        {
          path,
          via: [...via, getName(this)],
          value,
          predicate: this.options.fn
        }
      ];
    }
    return [null];
  }
}

export function predicate(predFn) {
  return namedPredicate(predFn.name || "[anonymous function]", predFn);
}

export function namedPredicate(name, predFn) {
  if (!predFn) {
    throw new Error(`Cannot use Predicate spec without predicate function.`);
  }
  return new Predicate(name, {
    fn: predFn,
    name: name
  });
}
