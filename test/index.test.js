import { expect } from "chai";
import { assert } from "../index";
import { number } from "../lib/predicates";

describe("index", () => {
  describe("assert", () => {
    it("does not throw an Error when valid", () => {
      expect(() => assert(number, 1)).to.not.throw(Error);
    });

    it("throws an Error when invalid", () => {
      expect(() => assert(number, "string")).to.throw(Error, "isNumber");
    });
  });
});
