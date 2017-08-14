import Spec from "./spec";
import { getName } from "../util";
import * as p from "../predicates";
import { invalid } from "../symbols";

export class Enum extends Spec {
  conform(value) {
    if (this.options.values.indexOf(value) !== -1) {
      return value;
    }
    return invalid;
  }

  toString() {
    return (
      this.name ||
      `Enum(${this.options.values.map(p => getName(p)).join(", ")})`
    );
  }

  explain(path, via, value) {
    if (this.options.values.indexOf(value) === -1) {
      return [
        {
          path,
          via: [...via, getName(this)],
          value,
          predicate: function contains(x) {
            return this.options.values.indexOf(x) !== -1;
          }
        }
      ];
    }
    return null;
  }
}

export default function oneOf(name, ...values) {
  if (!p.string(name)) {
    throw new Error(`Name ${name} must be a string.`);
  }
  if (values.length === 0) {
    throw new Error(`Cannot use Enum spec without values`);
  }
  // Not checking for undefined predicates because null and undefined might
  // be useful values in an enum.
  return new Enum(name, {
    values
  });
}
