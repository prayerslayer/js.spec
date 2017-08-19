import { catImpl as cat, altImpl as alt } from "../../lib/regex";
import map from "../../lib/spec/map";
import { conform, valid } from "../../lib/util";
import { invalid } from "../../lib/symbols";
import { expect } from "chai";
import { explainData } from "../../index";
import * as p from "../../lib/predicates";

describe("alt", () => {
  const ingredient_part = alt("quantity", p.number, "unit", p.string);
  const ingredient_variation = alt(
    "regular",
    cat("quantity", p.number, "unit", p.string),
    "reversed",
    cat("unit", p.string, "quantity", p.number)
  );

  it("throws when odd number of args provided", () => {
    expect(() => alt("foo")).to.throw();
  });

  describe("conform", () => {
    it("is valid", () => {
      expect(valid(ingredient_part, 5)).to.be.true;
      expect(valid(ingredient_part, "spoons")).to.be.true;
    });

    it("works with symbol tags", () => {
      const quantity = Symbol();
      const part = alt(quantity, p.number, "unit", p.string);
      expect(conform(part, 4)).to.deep.equal({
        [quantity]: 4
      });
      expect(conform(part, "spoons")).to.deep.equal({
        unit: "spoons"
      });
    });

    it("works with specs", () => {
      const userOrPwd = alt(
        "user",
        map("named", {
          name: p.string
        }),
        "password",
        p.string
      );
      expect(
        conform(userOrPwd, {
          name: "john"
        })
      ).to.deep.equal({
        user: {
          name: "john"
        }
      });
      expect(conform(userOrPwd, "secret")).to.deep.equal({
        password: "secret"
      });
    });

    it("works in happy case", () => {
      expect(conform(ingredient_part, 5)).to.deep.equal({
        quantity: 5
      });
      expect(conform(ingredient_part, "spoons")).to.deep.equal({
        unit: "spoons"
      });
    });

    it("works in negative case (not matching preds)", () => {
      expect(conform(ingredient_part, false)).to.equal(invalid);
    });

    it("works in negative case (too few items)", () => {
      expect(conform(ingredient_part, [])).to.equal(invalid);
    });

    it("works with too many items provided", () => {
      expect(conform(ingredient_part, [5, "spoons", "tops"])).to.deep.equal({
        quantity: 5
      });
    });

    it("works in happy nested case", () => {
      expect(
        conform(ingredient_variation, [5, "spoons"]),
        "regular"
      ).to.deep.equal({
        regular: {
          quantity: 5,
          unit: "spoons"
        }
      });
      expect(
        conform(ingredient_variation, ["spoons", 5]),
        "reversed"
      ).to.deep.equal({
        reversed: {
          quantity: 5,
          unit: "spoons"
        }
      });
    });

    it("works in negative nested case", () => {
      expect(conform(ingredient_variation, [false, "spoons"])).to.equal(
        invalid
      );
      expect(conform(ingredient_variation, [5, false])).to.equal(invalid);
      expect(conform(ingredient_variation, [5])).to.equal(invalid);
    });
  });

  describe("explain", () => {
    it("[happy case]", () => {
      const id = ingredient_variation;
      const problems = explainData(id, ["spoons", 5]);
      expect(problems).to.be.an("array").and.to.have.length(0);
    });

    it("[too many values]", () => {
      const problems = explainData(ingredient_variation, ["spoons", 5, 5]);
      expect(problems).to.be.an("array").and.to.have.length(0);
    });

    it("[too few values]", () => {
      const problems = explainData(ingredient_variation, ["spoons"]);
      // neither alternative matches because of too few values
      // ==> 2 problems
      //
      expect(problems).to.be.an("array").and.to.have.length(2);

      expect(problems).to.have.deep.nested
        .property("[0].predicate")
        .that.is.a("function");
      expect(problems).to.have.deep.nested
        .property("[0].path")
        .that.is.an("array")
        .and.deep.equals([0]);
      expect(problems).to.have.deep.nested
        .property("[0].via")
        .that.is.an("array")
        .and.deep.equals(["alt |", "regular", "cat ·"]);
      expect(problems).to.have.deep.nested
        .property("[0].value")
        .that.deep.equals(["spoons"]);

      expect(problems).to.have.deep.nested
        .property("[1].predicate")
        .that.is.a("function");
      expect(problems).to.have.deep.nested
        .property("[1].path")
        .that.is.an("array")
        .and.deep.equals([1]);
      expect(problems).to.have.deep.nested
        .property("[1].via")
        .that.is.an("array")
        .and.deep.equals(["alt |", "reversed", "cat ·"]);
      expect(problems).to.have.deep.nested
        .property("[1].value")
        .that.deep.equals(["spoons"]);
    });

    it("[wrong predicate]", () => {
      const problems = explainData(ingredient_variation, ["spoons", false]);
      // string, number doesn't match because false is not a number
      // number, string doesn't match because spoons is not a number and false not a string
      // ==> 3 problems

      expect(problems).to.be.an("array").and.to.have.length(3);

      expect(problems).to.have.deep.nested
        .property("[0].predicate")
        .that.is.a("function");
      expect(problems).to.have.deep.nested
        .property("[0].path")
        .that.is.an("array")
        .and.deep.equals([0, 0]);
      expect(problems).to.have.deep.nested
        .property("[0].via")
        .that.is.an("array")
        .and.deep.equals(["alt |", "regular", "cat ·", "quantity", "isNumber"]);
      expect(problems).to.have.deep.nested
        .property("[0].value")
        .that.deep.equals("spoons");

      expect(problems).to.have.deep.nested
        .property("[1].predicate")
        .that.is.a("function");
      expect(problems).to.have.deep.nested
        .property("[1].path")
        .that.is.an("array")
        .and.deep.equals([0, 1]);
      expect(problems).to.have.deep.nested
        .property("[1].via")
        .that.is.an("array")
        .and.deep.equals(["alt |", "regular", "cat ·", "unit", "isString"]);
      expect(problems).to.have.deep.nested
        .property("[1].value")
        .that.deep.equals(false);

      expect(problems).to.have.deep.nested
        .property("[2].predicate")
        .that.is.a("function");
      expect(problems).to.have.deep.nested
        .property("[2].path")
        .that.is.an("array")
        .and.deep.equals([1, 1]);
      expect(problems).to.have.deep.nested
        .property("[2].via")
        .that.is.an("array")
        .and.deep.equals([
          "alt |",
          "reversed",
          "cat ·",
          "quantity",
          "isNumber"
        ]);
      expect(problems).to.have.deep.nested
        .property("[2].value")
        .that.deep.equals(false);
    });
  });
});
