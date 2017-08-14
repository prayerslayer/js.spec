import { expect } from "chai";
import tuple from "../../lib/spec/tuple";
import * as p from "../../lib/predicates";
import { invalid } from "../../lib/symbols";
import { explainData } from "../../index";

describe("tuple", () => {
  describe("conform", () => {
    it("works with predicates", () => {
      const t = tuple("t", p.int, p.int);

      expect(t.conform([5, 5]), "happy case").to.deep.equal([5, 5]);
      expect(t.conform([5]), "not enough values").to.equal(invalid);
      expect(t.conform([5, 5, 5]), "too many values").to.equal(invalid);
      expect(t.conform(["string", 5]), "value type mismatch").to.equal(invalid);
      expect(t.conform("string"), "not an array").to.equal(invalid);
    });

    it("works with specs", () => {
      const point = tuple("point", p.int, p.int);
      const line = tuple("line", point, point);

      expect(line.conform([[0, 0], [0, 0]]), "happy case").to.deep.equal([
        [0, 0],
        [0, 0]
      ]);
      expect(line.conform([[0, 0]]), "not enough values").to.equal(invalid);
      expect(
        line.conform([[0, 0], [0, 0], [0, 0]]),
        "too many values"
      ).to.equal(invalid);
      expect(
        line.conform([[0, 0], "string"]),
        "line value type mismatch"
      ).to.equal(invalid);
      expect(
        line.conform([[0, 0], [0, "0"]]),
        "point value type mismatch"
      ).to.equal(invalid);
      expect(line.conform("string"), "not an array").to.equal(invalid);
    });
  });

  describe("explain", () => {
    it("works with predicates", () => {
      const t = tuple("t", p.int, p.int);
      const path = [];

      expect(explainData(t, [0, 0]), "happy case").to.deep.equal([]);

      const notAnArray = explainData(t, "string");
      expect(notAnArray).to.be.an("array").and.to.have.length(1);
      expect(notAnArray[0], "notAnArray").to.have.keys(
        "path",
        "via",
        "predicate",
        "predicateName",
        "value"
      );
      expect(notAnArray[0].path, "notAnArray").to.deep.equal(path);
      expect(notAnArray[0].via, "notAnArray").to.deep.equal(["t"]);
      expect(notAnArray[0], "notAnArray").to.have.property("value", "string");
      expect(notAnArray[0].predicate, "notAnArray").to.be.a("function");

      const missingValue = explainData(t, [0]);
      expect(missingValue).to.be.an("array").and.to.have.length(1);
      expect(missingValue[0], "missingValue").to.have.keys(
        "path",
        "via",
        "predicate",
        "predicateName",
        "value"
      );
      expect(missingValue[0].path, "missingValue").to.deep.equal(path);
      expect(missingValue[0].via, "missingValue").to.deep.equal(["t"]);
      expect(missingValue[0].value, "missingValue").to.deep.equal([0]);
      expect(missingValue[0].predicate, "missingValue").to.be.a("function");

      const extraValue = explainData(t, [0, 0, 0]);
      expect(extraValue, "extraValue").to.be.an("array").and.to.have.length(1);
      expect(extraValue[0], "extraValue").to.have.keys(
        "path",
        "via",
        "predicate",
        "predicateName",
        "value"
      );
      expect(extraValue[0].path, "extraValue").to.deep.equal(path);
      expect(extraValue[0].via, "extraValue").to.deep.equal(["t"]);
      expect(extraValue[0].value, "extraValue").to.deep.equal([0, 0, 0]);
      expect(extraValue[0].predicate, "extraValue").to.be.a("function");

      const wrongValue = explainData(t, ["0", 0]);
      expect(wrongValue, "wrongValue").to.be.an("array").and.to.have.length(1);
      expect(wrongValue[0], "wrongValue").to.have.keys(
        "path",
        "via",
        "predicate",
        "predicateName",
        "value"
      );
      expect(wrongValue[0].path, "wrongValue").to.deep.equal([0]);
      expect(wrongValue[0].via, "wrongValue").to.deep.equal(["t", "isInteger"]);
      expect(wrongValue[0].value, "wrongValue").to.deep.equal("0");
      expect(wrongValue[0].predicate, "wrongValue").to.be.a("function");
    });

    it("works with specs", () => {
      const point = tuple("point", p.int, p.int);
      const line = tuple("line", point, point);

      expect(explainData(line, [[0, 0], [0, 0]]), "happy case").to.deep.equal(
        []
      );

      const missingValue = explainData(line, [[0, 0]]);

      expect(missingValue, "missingValue").to.be
        .an("array")
        .and.to.have.length(1);
      expect(missingValue[0], "missingValue").to.have.keys(
        "path",
        "via",
        "predicate",
        "predicateName",
        "value"
      );
      expect(missingValue[0].path, "missingValue").to.deep.equal([]);
      expect(missingValue[0].via, "missingValue").to.deep.equal(["line"]);
      expect(missingValue[0].value, "missingValue").to.deep.equal([[0, 0]]);
      expect(missingValue[0].predicate, "missingValue").to.be.a("function");

      const wrongValue = explainData(line, [[0, 0], ["0", 0]]);
      expect(wrongValue, "wrongValue").to.be.an("array").and.to.have.length(1);
      expect(wrongValue[0], "wrongValue").to.have.keys(
        "path",
        "via",
        "predicate",
        "predicateName",
        "value"
      );
      expect(wrongValue[0].via, "wrongValue").to.deep.equal([
        "line",
        "point",
        "isInteger"
      ]);
      expect(wrongValue[0].path, "wrongValue").to.deep.equal([1, 0]);
      expect(wrongValue[0].value, "wrongValue").to.deep.equal("0");
      expect(wrongValue[0].predicate, "wrongValue").to.be.a("function");
    });
  });
});
