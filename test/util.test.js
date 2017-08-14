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
    it("prints with arrays", () => {
      expect(() => undefinedPredicateWarning("Array", [null])).to.throw();
    });
    it("prints with objects", () => {
      expect(() =>
        undefinedPredicateWarning("Array", { foo: undefined })
      ).to.throw();
    });
    it("prints with single nilable values", () => {
      expect(() =>
        undefinedPredicateWarning("Undefined", undefined)
      ).to.throw();
      expect(() => undefinedPredicateWarning("Null", null)).to.throw();
    });
    it("is silent with other types", () => {
      undefinedPredicateWarning("String", { foo: "undefined" });
      undefinedPredicateWarning("Bool", { foo: false });
    });
  });
});
