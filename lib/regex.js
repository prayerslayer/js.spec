// http://www.ccs.neu.edu/home/turon/re-deriv.pdf
import {
  dt,
  symbolToString,
  zip,
  valid,
  explain,
  getName,
  undefinedPredicateWarning
} from "./util";
import { Nilable } from "./spec/nilable";
import { invalid } from "./symbols";
import * as p from "./predicates";
// ops
const amp = Symbol("amp &");
const rep = Symbol("rep *");
const alt = Symbol("alt |");
const cat = Symbol("cat ·");
const acc = Symbol("accepted");

/**
 * Wraps value in regex object of with operation "accepted".
 */
function accept(x) {
  return {
    op: acc,
    ret: x
  };
}

/**
 * Returns true iff value.op equals accepted.
 */
function accepted(x) {
  return x && x.op && x.op === acc;
}

export function isRegex(x) {
  // TODO could use map spec for this?
  return p.obj(x) && p.symbol(x.op);
}

/**
 * Returns derivative for cat operation with regard to x.
 *
 * ∂a (r · s) = ∂a r · s + ν(r) · ∂a s
 */
function catDeriv(regex, x) {
  const [p0, ...prest] = regex.ps;
  const [k0, ...krest] = regex.ks;

  const derivations = [
    pcat({
      ps: [deriv(p0, x), ...prest],
      ks: regex.ks,
      ret: regex.ret
    })
  ];

  if (acceptsNil(p0)) {
    derivations.push(
      deriv(
        pcat({
          ps: prest,
          ks: krest,
          ret: [
            ...regex.ret,
            k0
              ? {
                  [k0]: null
                }
              : null
          ]
        })
      )
    );
  }

  return palt({
    ps: derivations
  });
}

/**
 * Returns derivative for alt operation with regard to x.
 *
 * ∂a (r + s) = ∂a r + ∂a s
 */
function altDeriv(regex, x) {
  return palt({
    ps: regex.ps.map(p => deriv(p, x)),
    ks: regex.ks,
    ret: regex.ret
  });
}

/**
 * Calculates derivative of regex with respect to x.
 *
 * @param  {[type]} regex [description]
 * @param  {[type]} x     [description]
 * @return {[type]}       [description]
 */
export function deriv(regex, x) {
  if (!isRegex(regex)) {
    if (regex === null) {
      return null;
    }
    const ret = dt(regex, x);
    return ret === invalid ? null : accept(ret);
  }

  switch (regex.op) {
    case acc:
      return null;
    case alt:
      return altDeriv(regex, x);
    case cat:
      return catDeriv(regex, x);
  }
  throw new Error(
    `Cannot derive unknown operation "${symbolToString(regex.op)}"`
  );
}

function getReturn(regex) {
  switch (regex.op) {
    case cat:
      const catProcessed = regex.ret.reduce(
        (agg, val) => ({ ...agg, ...val }),
        {}
      );
      // unprocessed values
      regex.ks.forEach(k => (catProcessed[k] = null));
      return catProcessed;
    case acc:
    case alt:
      return regex.ret;
  }
  throw new Error(`Return for ${symbolToString(regex.op)} not implemented`);
}

/**
 * Conform for regex objects. Returns conformed value when regex
 * matches data, invalid otherwise.
 */
export function regexConform(regex, data) {
  const [x0, ...xrest] = data;
  const dx = deriv(regex, x0);
  if (accepted(dx)) {
    return dx.ret;
  }
  if (xrest.length > 0) {
    return regexConform(dx, xrest);
  }
  if (acceptsNil(dx)) {
    return getReturn(dx);
  }
  return invalid;
}

export function regexExplain(regex, path, via, value) {
  // no value provided, so no problems can occur
  if (p.nil(value)) {
    return null;
  }

  if (valid(regex, value)) {
    return null;
  }

  // regex is not a regex, defer to spec explain implementation
  if (!isRegex(regex)) {
    return explain(regex, path, via, value);
  }
  // it's a regex, but value is not a collection(???)
  if (!Array.isArray(value)) {
    return [
      {
        path,
        via,
        value,
        predicate: Array.isArray
      }
    ];
  }

  switch (regex.op) {
    case cat:
      if (value.length < regex.ps.length) {
        return [
          {
            path,
            via: [...via, getName(regex)],
            value,
            predicate: function hasLength(val) {
              return val.length >= regex.ps.length;
            }
          }
        ];
      }
      return regex.ps
        .map((p, i) => [valid(p, value[i]), p, i])
        .filter(([valid]) => !valid)
        .map(([, p, i]) =>
          explain(
            p,
            [...path, i],
            [...via, getName(regex), regex.ks[i]],
            value[i]
          )
        );
    case alt:
      // if value does not match alt, ALL alternatives have to yield a problem
      return regex.ps.map((p, i) =>
        explain(p, [...path, i], [...via, getName(regex), regex.ks[i]], value)
      );
    case acc:
      return null;
  }
}

function acceptsNil(regex) {
  if (!isRegex(regex)) {
    return regex === p.nil || regex instanceof Nilable;
  }
  switch (regex.op) {
    case alt:
      return regex.ps.some(p => acceptsNil(p));
    case cat:
      return regex.ps.every(p => acceptsNil(p));
    default:
      // TODO
      return false;
  }
}

/**
 * Returns regex object for cat. Do not use directly, use catImpl.
 */
function pcat(opts = {}) {
  const { ps = [], ks = [], ret = [] } = opts;
  const [p0, ...prest] = ps;
  const [k0, ...krest] = ks;
  if (accepted(p0)) {
    const pret = [
      ...ret,
      k0
        ? {
            [k0]: p0.ret
          }
        : p0.ret
    ];
    if (prest.length > 0) {
      return pcat({
        ps: prest,
        ks: krest,
        ret: pret
      });
    }
    // there are no more values
    // we convert the array of matches to a single map and return that
    return accept(
      getReturn(
        pcat({
          ret: pret
        })
      )
    );
  }
  return {
    op: cat,
    ps,
    ks,
    ret
  };
}

/**
 * Used to filter predicates according to a function.
 */
function filter(ps, ks, fn) {
  if (ks.length > 0) {
    const filtered = zip(ps, ks).filter(([p]) => fn(p));
    if (filtered.length > 0) {
      return zip(...filtered);
    }
    return [[], []];
  }
  return [ps.filter(p => fn(p)), []];
}

/**
 * Returns regex object for alt. Do not use directly, use altImpl.
 */
function palt(opts = {}) {
  let { ps = [], ks = [], ret = {} } = opts;
  // we need to remove null (= not matching) predicates
  [ps, ks] = filter(ps, ks, x => !!x);
  const [p0, ...prest] = ps;
  const [k0] = ks;

  const _alt = {
    op: alt,
    ps,
    ks,
    ret
  };
  console.log(JSON.stringify(ps, null, 2));
  // if any of the alternatives is accepted, return that
  const acceptIdx = ps.findIndex(p => accepted(p));
  if (acceptIdx !== -1) {
    if (ks[acceptIdx]) {
      console.log(acceptIdx, {
        [ks[acceptIdx]]: ps[acceptIdx].ret
      });
      return accept({
        [ks[acceptIdx]]: ps[acceptIdx].ret
      });
    }
    return accept(ps[acceptIdx].ret);
  }
  // return first predicate if there are no keys and no other alternatives
  if (prest.length === 0 && !k0) {
    return p0;
  }
  // else just return the whole regex object
  return _alt;
}

// xy
export function catImpl(...predicates) {
  if (p.odd(predicates.length)) {
    throw new Error(
      `Must provide an even number of arguments to cat. Provided: ${predicates.length}`
    );
  }
  const ks = predicates.filter((_, i) => p.even(i));
  const ps = predicates.filter((_, i) => p.odd(i));
  undefinedPredicateWarning("[cat regex]", ps);
  return pcat({
    ps,
    ks
  });
}

// (x | y)
export function altImpl(...predicates) {
  if (p.odd(predicates.length)) {
    throw new Error(
      `Must provide an even number of arguments to alt. Provided: ${predicates.length}`
    );
  }
  const ks = predicates.filter((_, i) => p.even(i));
  const ps = predicates.filter((_, i) => p.odd(i));
  undefinedPredicateWarning("[alt regex]", ps);
  return palt({
    ps,
    ks
  });
}

// x*
export function kleeneImpl() {}

// x+
export function plusImpl() {}

// x?
export function maybeImpl(name, predicate) {
  if (p.nil(name) || !p.string(name)) {
    throw new Error(`Must provide a name to maybe.`);
  }
  if (p.nil(predicate)) {
    throw new Error(`Must provide a predicate to maybe.`);
  }
  return palt({
    ps: [p.nil, predicate],
    ks: [name, name]
  });
}

//????
export function ampImpl() {}
