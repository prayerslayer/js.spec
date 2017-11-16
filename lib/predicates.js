import set from "lodash.isset";
import number from "lodash.isnumber";
import fn from "lodash.isfunction";
import obj from "lodash.isplainobject";
import nil from "lodash.isnil";
import bool from "lodash.isboolean";
import date from "lodash.isdate";
import int from "lodash.isinteger";
import str from "lodash.isstring";
import sym from "lodash.issymbol";
import finite from "lodash.isfinite";

const isArray = Array.isArray;

function isNil(x) {
  return nil(x);
}

function isFinite(x) {
  return finite(x);
}

function isNumber(x) {
  return number(x);
}

function isFunction(x) {
  return fn(x);
}

function isObject(x) {
  return obj(x);
}

function isSet(x) {
  return set(x);
}

function isBoolean(x) {
  return bool(x);
}

function isDate(x) {
  return date(x);
}

function isInteger(x) {
  return int(x);
}

function isString(x) {
  return str(x);
}

function isSymbol(x) {
  return sym(x);
}

export {
  isNil as nil,
  isNumber as number,
  isFinite as finite,
  isFunction as fn,
  isObject as obj,
  isObject as object,
  isSet as set,
  isBoolean as bool,
  isBoolean as boolean,
  isDate as date,
  isInteger as int,
  isInteger as integer,
  isString as str,
  isString as string,
  isSymbol as sym,
  isSymbol as symbol,
  isArray as array
};

// predicates for collections
export function coll(maybeCollection) {
  return isArray(maybeCollection) || isSet(maybeCollection);
}

// convenience predicates on primitives

// i think even is useless for real-world apps but removing
// it would break all my tests, so it stays.
export function even(nr) {
  return number(nr) && nr % 2 === 0;
}

export function odd(nr) {
  return number(nr) && !even(nr);
}

export function positive(nr) {
  return number(nr) && nr > 0;
}

export function negative(nr) {
  return number(nr) && nr < 0;
}

export function zero(nr) {
  return nr === 0;
}
