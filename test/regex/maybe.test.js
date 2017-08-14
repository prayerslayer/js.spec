import { maybeImpl as maybe, catImpl as cat } from "../../lib/regex";
import { conform } from "../../lib/util";
import { expect } from "chai";
import * as p from "../../lib/predicates";

const maybe_ingredient = maybe(
  "ingredient",
  cat("quantity", p.number, "unit", p.string)
);

describe("maybe", () => {
  describe("conform", () => {
    it("works in happy case", () => {
      expect(conform(maybe_ingredient), "no value").to.deep.equal({
        ingredient: null
      });
      expect(conform(maybe_ingredient, []), "empty array").to.deep.equal({
        ingredient: null
      });
      expect(conform(maybe_ingredient, [5, "spoons"]), "value").to.deep.equal({
        ingredient: {
          unit: "spoons",
          quantity: 5
        }
      });
    });

    it("works in nested case", () => {
      const ingredient = cat(
        "quantity",
        maybe("number", p.number),
        "unit",
        maybe("string", p.string)
      );
      expect(conform(ingredient, [])).to.deep.equal({
        quantity: {
          number: null
        },
        unit: {
          string: null
        }
      });
    });
  });
});
