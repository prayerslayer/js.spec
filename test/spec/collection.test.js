import { expect } from "chai";
import collection from "../../lib/spec/collection";
import map from "../../lib/spec/map";
import * as p from "../../lib/predicates";
import { explainData } from "../../index";
import { invalid, count, minCount, maxCount } from "../../lib/symbols";

describe("collection", () => {
  describe("factory", () => {
    it("[non-string name]", () => {
      expect(() => collection(77, p.String)).to.throw(Error);
    });
  });

  describe("explain", () => {
    describe("works with specs", () => {
      const friend = map("friend", {
        name: p.string
      });
      const spec = collection("1-3 friends", friend, {
        [minCount]: 1,
        [maxCount]: 3
      });

      it("[not a collection]", () => {
        const problems = explainData(spec, "string");
        expect(problems).to.be.an("array").and.have.length(1);
        expect(problems).to.have.deep.nested
          .property("[0].value")
          .that.deep.equals("string");
        expect(problems).to.have.deep.nested
          .property("[0].predicate")
          .that.is.a("function");
        expect(problems).to.have.deep.nested
          .property("[0].via")
          .that.is.an("array")
          .and.deep.equals(["1-3 friends"]);
        expect(problems).to.have.deep.nested
          .property("[0].path")
          .that.is.an("array")
          .and.deep.equals([]);
      });

      it("[invalid item]", () => {
        const problems = explainData(spec, ["string"]);
        expect(problems).to.be.an("array").and.have.length(1);
        expect(problems).to.have.deep.nested
          .property("[0].value")
          .that.deep.equals("string");
        expect(problems).to.have.deep.nested
          .property("[0].predicate")
          .that.is.a("function");
        expect(problems).to.have.deep.nested
          .property("[0].via")
          .that.is.an("array")
          .and.deep.equals(["friend"]);
        expect(problems).to.have.deep.nested
          .property("[0].path")
          .that.is.an("array")
          .and.deep.equals([0]);
      });

      it("[invalid nested item]", () => {
        const problems = explainData(spec, [
          {
            name: 3000
          }
        ]);
        expect(problems).to.be.an("array").and.have.length(1);
        expect(problems).to.have.deep.nested
          .property("[0].value")
          .that.deep.equals(3000);
        expect(problems).to.have.deep.nested
          .property("[0].predicate")
          .that.is.a("function");
        expect(problems).to.have.deep.nested
          .property("[0].via")
          .that.is.an("array")
          .and.deep.equals(["friend", "isString"]);
        expect(problems).to.have.deep.nested
          .property("[0].path")
          .that.is.an("array")
          .and.deep.equals([0, "name"]);
      });

      it("[too many items]", () => {
        const problems = explainData(spec, [1, 2, 3, 4]);
        expect(problems).to.be.an("array").and.have.length(1);
        expect(problems).to.have.deep.nested
          .property("[0].value")
          .that.deep.equals([1, 2, 3, 4]);
        expect(problems).to.have.deep.nested
          .property("[0].predicate")
          .that.is.a("function");
        expect(problems).to.have.deep.nested
          .property("[0].via")
          .that.is.an("array")
          .and.deep.equals(["1-3 friends"]);
        expect(problems).to.have.deep.nested
          .property("[0].path")
          .that.is.an("array")
          .and.deep.equals([]);
      });

      it("[too few items]", () => {
        const problems = explainData(spec, []);
        expect(problems).to.be.an("array").and.have.length(1);
        expect(problems).to.have.deep.nested
          .property("[0].value")
          .that.deep.equals([]);
        expect(problems).to.have.deep.nested
          .property("[0].predicate")
          .that.is.a("function");
        expect(problems).to.have.deep.nested
          .property("[0].via")
          .that.is.an("array")
          .and.deep.equals(["1-3 friends"]);
        expect(problems).to.have.deep.nested
          .property("[0].path")
          .that.is.an("array")
          .and.deep.equals([]);
      });
    });

    describe("works with predicates", () => {
      const spec = collection("some ints", p.int, {
        [minCount]: 1,
        [maxCount]: 3
      });

      it("[not a collection]", () => {
        const problems = explainData(spec, "string");
        expect(problems).to.be.an("array").and.have.length(1);
        expect(problems).to.have.deep.nested
          .property("[0].value")
          .that.deep.equals("string");
        expect(problems).to.have.deep.nested
          .property("[0].predicate")
          .that.is.a("function");
        expect(problems).to.have.deep.nested
          .property("[0].via")
          .that.is.an("array")
          .and.deep.equals(["some ints"]);
        expect(problems).to.have.deep.nested
          .property("[0].path")
          .that.is.an("array")
          .and.deep.equals([]);
      });

      it("[invalid item]", () => {
        const problems = explainData(spec, ["string"]);
        expect(problems).to.be.an("array").and.have.length(1);
        expect(problems).to.have.deep.nested
          .property("[0].value")
          .that.deep.equals("string");
        expect(problems).to.have.deep.nested
          .property("[0].predicate")
          .that.is.a("function");
        expect(problems).to.have.deep.nested
          .property("[0].via")
          .that.is.an("array")
          .and.deep.equals(["isInteger"]);
        expect(problems).to.have.deep.nested
          .property("[0].path")
          .that.is.an("array")
          .and.deep.equals([0]);
      });

      it("[too many items]", () => {
        const problems = explainData(spec, [1, 2, 3, 4]);
        expect(problems).to.be.an("array").and.have.length(1);
        expect(problems).to.have.deep.nested
          .property("[0].value")
          .that.deep.equals([1, 2, 3, 4]);
        expect(problems).to.have.deep.nested
          .property("[0].predicate")
          .that.is.a("function");
        expect(problems).to.have.deep.nested
          .property("[0].via")
          .that.is.an("array")
          .and.deep.equals(["some ints"]);
        expect(problems).to.have.deep.nested
          .property("[0].path")
          .that.is.an("array")
          .and.deep.equals([]);
      });

      it("[too few items]", () => {
        const problems = explainData(spec, []);
        expect(problems).to.be.an("array").and.have.length(1);
        expect(problems).to.have.deep.nested
          .property("[0].value")
          .that.deep.equals([]);
        expect(problems).to.have.deep.nested
          .property("[0].predicate")
          .that.is.a("function");
        expect(problems).to.have.deep.nested
          .property("[0].via")
          .that.is.an("array")
          .and.deep.equals(["some ints"]);
        expect(problems).to.have.deep.nested
          .property("[0].path")
          .that.is.an("array")
          .and.deep.equals([]);
      });
    });
  });

  describe("conform", () => {
    it("works with optional params [count]", () => {
      const spec = collection("exactly 2 ints", p.int, {
        [count]: 2
      });

      expect(
        spec.conform([1, 2]),
        "array - count, happy"
      ).to.contain.ordered.members([1, 2]);

      expect(spec.conform(new Set([1, 2])), "set - count, happy").to.be
        .a("Set")
        .that.contains(1, 2)
        .and.to.have.property("size", 2);

      expect(spec.conform([1]), "array - count, too few").to.equal(invalid);
      expect(spec.conform(new Set([1])), "set - count, too few").to.equal(
        invalid
      );

      expect(spec.conform([1, 1, 1]), "array - count, too many").to.equal(
        invalid
      );
      expect(
        spec.conform(new Set([1, 1, 1])),
        "set - count, too many"
      ).to.equal(invalid);
    });

    it("works with optional params [minCount]", () => {
      const spec = collection("min 2 ints", p.int, {
        [minCount]: 2
      });

      expect(spec.conform([1, 2]), "array - equal").to.contain.ordered.members([
        1,
        2
      ]);
      expect(spec.conform(new Set([1, 2])), "set - equal").to.be
        .a("Set")
        .that.contains(1, 2)
        .and.to.have.property("size", 2);

      expect(
        spec.conform([1, 1, 1]),
        "array - more"
      ).to.contain.ordered.members([1, 1, 1]);
      expect(spec.conform(new Set([1, 2, 3])), "set - more").to.be
        .a("Set")
        .that.contains(1, 2, 3)
        .and.to.have.property("size", 3);

      expect(spec.conform([1]), "array - too few").to.equal(invalid);
      expect(spec.conform(new Set([1])), "set - too few").to.equal(invalid);
    });

    it("works with optional params [maxCount]", () => {
      const spec = collection("max 2 ints", p.int, {
        [maxCount]: 2
      });

      expect(spec.conform([1, 2]), "array - equal").to.contain.ordered.members([
        1,
        2
      ]);
      expect(spec.conform(new Set([1, 2])), "set - equal").to.be
        .a("Set")
        .that.contains(1, 2)
        .and.to.have.property("size", 2);

      expect(spec.conform([1]), "array - less").to.contain.ordered.members([1]);
      expect(spec.conform(new Set([1])), "set - less").to.be
        .a("Set")
        .that.contains(1)
        .and.to.have.property("size", 1);

      expect(spec.conform([1, 1, 1]), "array - too many").to.equal(invalid);
      expect(spec.conform(new Set([1, 2, 3])), "set - too many").to.equal(
        invalid
      );
    });

    it("works on predicates", () => {
      const spec = collection("ints", p.int);
      const value = [1, 2];
      expect(spec.conform(value), "array").to.contain.ordered.members(value);
      const s = new Set(value);
      expect(spec.conform(s), "set").to.be
        .a("Set")
        .that.contains(1, 2)
        .and.to.have.property("size", 2);

      expect(spec.conform([]), "array").to.be.empty;
      expect(spec.conform(new Set([])), "set").to.be.a("Set").that.is.empty;
    });

    it("works on specs", () => {
      const friend = map("friend", {
        name: p.string
      });
      const spec = collection("friends", friend);
      const value = [
        {
          name: "holger"
        },
        {
          name: "birgit"
        }
      ];
      expect(spec.conform(value), "array").to.deep.equal(value);
      const s = new Set(value);
      expect(spec.conform(s), "set").to.be
        .a("Set")
        .that.deep.contains(value[0], value[1])
        .and.to.have.property("size", 2);
    });

    it("works on spec aliases", () => {
      const friend = map("friend", {
        name: p.string
      });
      const spec = collection("friends", friend);
      const value = [
        {
          name: "holger"
        },
        {
          name: "birgit"
        }
      ];
      expect(spec.conform(value), "array").to.deep.equal(value);
      const s = new Set(value);
      expect(spec.conform(s), "set").to.be
        .a("Set")
        .that.deep.contains(value[0], value[1])
        .and.to.have.property("size", 2);
    });
  });
});
