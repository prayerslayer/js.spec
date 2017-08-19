import Spec from "./spec";
import {
  valid,
  explain,
  dt,
  specize,
  getName,
  cardinality,
  undefinedPredicateWarning
} from "../util";
import * as p from "../predicates";
import { invalid, count, minCount, maxCount } from "../symbols";

export class Collection extends Spec {
  conform(value) {
    if (!p.coll(value)) {
      return invalid;
    }

    const card = cardinality(value);
    const countOption = this.options[count];
    const minCountOption = this.options[minCount];
    const maxCountOption = this.options[maxCount];
    if (countOption) {
      if (p.int(countOption) && card !== countOption) {
        return invalid;
      }
    } else if (minCountOption || maxCountOption) {
      if (p.int(minCountOption) && minCountOption > card) {
        return invalid;
      }
      if (p.int(maxCountOption) && maxCountOption < card) {
        return invalid;
      }
    }

    const spreadValue = p.array(value) ? value : [...value];
    const ret = spreadValue
      .map(val => dt(this.options.spec, val))
      .filter(val => val !== invalid);

    if (spreadValue.length > ret.length) {
      return invalid;
    }
    return p.array(value) ? ret : new Set(ret);
  }

  toString() {
    return this.name || `Collection(${getName(this.options.spec)})`;
  }

  explain(path, via, value) {
    if (!p.coll(value)) {
      return [
        {
          path,
          via: [...via, getName(this)],
          value,
          predicate: p.coll
        }
      ];
    }
    const card = cardinality(value);
    const countOption = this.options[count];
    const minCountOption = this.options[minCount];
    const maxCountOption = this.options[maxCount];
    if (countOption) {
      if (p.int(countOption) && card !== countOption) {
        return [
          {
            path,
            via: [...via, getName(this)],
            value,
            predicate: function cardinality(v) {
              return cardinality(v) === countOption;
            }
          }
        ];
      }
    } else if (minCountOption || maxCountOption) {
      if (p.int(minCountOption) && minCountOption > card) {
        return [
          {
            path,
            via: [...via, getName(this)],
            value,
            predicate: function cardinality(v) {
              return cardinality(v) === minCountOption;
            }
          }
        ];
      }
      if (p.int(maxCountOption) && maxCountOption < card) {
        return [
          {
            path,
            via: [...via, getName(this)],
            value,
            predicate: function cardinality(v) {
              return cardinality(v) === maxCountOption;
            }
          }
        ];
      }
    }

    return [...value.entries()].map(([key, val]) => {
      if (!valid(this.options.spec, val)) {
        return explain(this.options.spec, [...path, key], via, val);
      }
      return null;
    });
  }
}

export default function collection(name, spec, opts = {}) {
  if (!p.string(name)) {
    throw new Error(`Name ${name} must be a string.`);
  }
  undefinedPredicateWarning(name, spec);
  const params = Object.assign({}, opts, { spec: specize(spec) });
  return new Collection(name, params);
}
