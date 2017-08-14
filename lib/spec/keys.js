import Spec from "./spec";
import { getName } from "../util";
import * as p from "../predicates";
import { invalid } from "../symbols";

export class Keys extends Spec {
  conform(value) {
    if (p.object(value)) {
      for (const key of this.options.requiredKeys) {
        if (!value.hasOwnProperty(key)) {
          return invalid;
        }
      }
      return value;
    }
    return invalid;
  }

  explain(path, via, value) {
    if (!p.object(value)) {
      return [
        {
          path,
          via,
          value,
          predicate: p.object
        }
      ];
    }
    return this.options.requiredKeys.map(key => {
      if (!value.hasOwnProperty(key)) {
        return {
          path: [...path, key],
          via: [...via, getName(this)],
          value,
          predicate: function hasKey(value) {
            return value.hasOwnProperty(key);
          }
        };
      }
      return null;
    });
  }

  toString() {
    return (
      this.name ||
      `Keys(${this.options.requiredKeys.map(k => getName(k)).join(", ")})`
    );
  }
}

export default function keys(name, ...requiredKeys) {
  if (!p.string(name)) {
    throw new Error(`Name ${name} must be a string.`);
  }
  if (requiredKeys.length === 0) {
    throw new Error(`Cannot use Keys spec without keys.`);
  }
  return new Keys(name, {
    requiredKeys
  });
}
