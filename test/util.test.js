import { expect } from "chai";
import { zip, undefinedPredicateWarning } from "../lib/util";

describe("util", () => {
  describe("zip", () => {
    it("is reversible", () => {
      const colls = [[1, 2, 3], [4, 5, 6]];
      expect(colls).to.deep.equal(zip(...zip(...colls)));
    });
  });

  describe("undefinedPredicateWarning", () => {
    const originalConsoleWarn = console.warn;

    afterEach(() => {
      console.warn = originalConsoleWarn;
    });
    it("prints with arrays", done => {
      console.warn = () => done();
      undefinedPredicateWarning("Array", [null]);
    });
    it("prints with objects", done => {
      console.warn = () => done();
      undefinedPredicateWarning("Array", { foo: undefined });
    });
    it("is silent with other types", done => {
      console.warn = done;
      undefinedPredicateWarning("String", { foo: "undefined" });
      undefinedPredicateWarning("Bool", { foo: false });
      undefinedPredicateWarning("Undefined", undefined);
      undefinedPredicateWarning("Null", null);
      done();
    });
  });
});
