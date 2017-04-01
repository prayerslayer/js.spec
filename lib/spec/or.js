import Spec from "./spec";
import { valid, explain, dt, specize, getName, getAllKeys } from "../util";
import * as p from "../predicates";
import { invalid } from "../symbols";

export class Or extends Spec {
  conform(value) {
    for (const [key, spec] of this.options.alternatives) {
      const conformed = dt(spec, value);
      if (conformed !== invalid) {
        return [key, conformed];
      }
    }
    return invalid;
  }

  toString() {
    return this.name ||
      `Or(${this.options.alternatives.map(([s]) => getName(s)).join(", ")})`;
  }

  explain(path, via, value) {
    if (!valid(this, value)) {
      return this.options.alternatives.map(([key, spec]) => {
        if (!valid(spec, value)) {
          return explain(spec, path, [...via, getName(this), key], value);
        }
        return null;
      });
    }
    return null;
  }
}

export default function or(name, alts) {
  if (!p.string(name)) {
    throw new Error(`Name ${name} must be a string.`);
  }
  if (!p.obj(alts)) {
    throw new Error(`Must provide named alternatives with a map to Or.`);
  }
  const keys = getAllKeys(alts);
  if (keys.length === 0) {
    throw new Error(`Must provide at least one alternative to Or.`);
  }
  return new Or(name, {
    alternatives: keys.map(k => [k, specize(alts[k])])
  });
}
