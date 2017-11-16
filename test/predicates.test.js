import { expect } from "chai";
import * as p from "../lib/predicates";

describe("predicate", () => {
  describe("number", () => {
    [
      -10,
      0,
      10,
      20000,
      3.14,
      1 / 2,
      -Infinity,
      Infinity,
      NaN,
      Number.MAX_VALUE,
      Number.MIN_VALUE
    ].forEach(nr =>
      it(`returns true for ${nr}`, () => {
        expect(p.number(nr)).to.be.true;
      })
    );
    [
      true,
      false,
      "string",
      {},
      [],
      null,
      undefined
    ].forEach(nr =>
      it(`returns false for ${nr}`, () => {
        expect(p.number(nr)).to.be.false;
      })
    );
  });
  describe("finite", () => {
    [
      -10,
      0,
      10,
      20000,
      3.14,
      1 / 2,
      Number.MAX_VALUE,
      Number.MIN_VALUE
    ].forEach(nr =>
      it(`returns true for ${nr}`, () => {
        expect(p.finite(nr)).to.be.true;
      })
    );
    [
      -Infinity,
      Infinity,
      NaN,
      true,
      false,
      "string",
      {},
      [],
      null,
      undefined
    ].forEach(nr =>
      it(`returns false for ${nr}`, () => {
        expect(p.finite(nr)).to.be.false;
      })
    );
  });
  describe("integer", () => {
    [
      -10,
      0,
      10,
      20000,
      Number.MAX_VALUE
    ].forEach(nr =>
      it(`returns true for ${nr}`, () => {
        expect(p.int(nr)).to.be.true;
      })
    );
    [
      -Infinity,
      Infinity,
      Number.MIN_VALUE,
      NaN,
      3.14,
      1 / 2,
      true,
      false,
      "string",
      {},
      [],
      null,
      undefined
    ].forEach(nr =>
      it(`returns false for ${nr}`, () => {
        expect(p.int(nr)).to.be.false;
      })
    );
  });
});

/*
 * TODO
 * since most predicates are directly taken from lodash I won't write tests
 * for them just now. however it would beneficial in order to swap implementation
 * later.
 */
