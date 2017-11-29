import Spec from "./spec";
import keys from "./keys";
import {
  valid,
  explain,
  dt,
  specize,
  getName,
  getAllKeys,
  undefinedPredicateWarning
} from "../util";
import * as p from "../predicates";
import { invalid, optional } from "../symbols";

export class Map extends Spec {
  constructor(name, options) {
    super(name, options);
    if (options.requiredKeys.length > 0) {
      this.keySpec = keys(`Keys(${this.name})`, ...options.requiredKeys);
    }
  }
  conform(value) {
    if (p.object(value)) {
      if (this.keySpec && !valid(this.keySpec, value)) {
        return invalid;
      }
      const ret = {};
      for (const key of getAllKeys(value)) {
        const v = value[key];
        const spec =
          this.options.requiredSpecs[key] ||
          this.options.optionalSpecs[key] ||
          null;
        if (spec !== null) {
          const conformed = dt(spec, v);
          if (conformed === invalid) {
            return invalid;
          }
          ret[key] = conformed;
        } else {
          ret[key] = v;
        }
      }
      return ret;
    }
    return invalid;
  }

  toString() {
    return this.name || `Map`;
  }

  explain(path, via, value) {
    if (this.keySpec && !valid(this.keySpec, value)) {
      return explain(this.keySpec, path, [...via, getName(this)], value);
    }
    return getAllKeys(value).map(key => {
      const v = value[key];
      const hasSpec =
        this.options.requiredSpecs[key] ||
        this.options.optionalSpecs[key] ||
        null;
      if (hasSpec) {
        const spec = specize(hasSpec);
        if (!valid(spec, v)) {
          return explain(
            spec,
            [...path, key],
            [...via, getName(this)],
            value[key]
          );
        }
      }
      return null;
    });
  }
}

export default function map(name, shape) {
  if (!p.string(name)) {
    throw new Error(`Name ${name} must be a string`);
  }
  if (!shape || !p.obj(shape)) {
    throw new Error(`Cannot use Map spec with shape ${shape}`);
  }
  const optionalSpecs = shape[optional] || {};
  const optionalKeys = getAllKeys(optionalSpecs);
  const requiredSpecs = shape;
  const requiredKeys = getAllKeys(shape);

  if (requiredKeys.length > 0) {
    undefinedPredicateWarning(name, shape);
  }
  if (optionalKeys.length > 0) {
    undefinedPredicateWarning(name, shape[optional]);
  }

  return new Map(name, {
    requiredKeys,
    requiredSpecs,
    optionalKeys,
    optionalSpecs
  });
}
