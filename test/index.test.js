import { expect } from "chai";
import { assert, explainStr, spec } from "../index";
import { number, string } from "../lib/predicates";

describe("index", () => {
  describe("assert", () => {
    it("does not throw an Error when valid", () => {
      expect(() => assert(number, 1)).to.not.throw(Error);
    });

    it("throws an Error when invalid", () => {
      expect(() => assert(number, "not a number")).to.throw(Error, "isNumber");
    });
  });

  describe("predicate", () => {
    it("creates a predicate spec from a function", () => {
      const predSpec = spec.predicate("predicate test", value => value);
      expect(predSpec.conform(true)).to.equal(true);
    });
  });

  describe("explainStr", () => {
    function noSpacesSpec(value) {
      return /\.s+/.test(value);
    }

    it("explains an error with no path", () => {
      const noSpaces = spec.and("check spaces", string, noSpacesSpec);
      const actual = explainStr(noSpaces, "Hi there");
      expect(actual).to.include("noSpacesSpec");
    });

    const school = spec.map("school", {
      district: spec.string
    });
    const friend = spec.map("friend", {
      name: spec.string,
      school
    });

    it("explains an error when there is a path to the error", () => {
      const value = {
        name: "holger",
        school: {}
      };
      const actual = explainStr(friend, value);
      expect(actual).to.include(" at ");
    });
  });
});
