import { expect } from "chai";
import or from "../../lib/spec/or";
import map from "../../lib/spec/map";
import * as p from "../../lib/predicates";
import { explainData } from "../../index";
import { invalid } from "../../lib/symbols";

const friend = map("named", {
  name: p.string
});
const positioned = map("positioned", {
  lat: p.number,
  lon: p.number
});
const positioned_friend = or("positioned or friend", {
  positioned,
  friend
});
const big_even = or("big or even", {
  even: p.even,
  big: x => p.number(x) && x > 1000 // thanks, JS type coercion
});

describe("or", () => {
  describe("explain", () => {
    describe("works on specs", () => {
      it("[not a friend, not positioned]", () => {
        const err = {
          name: 13,
          lat: "berlin"
        };
        const problems = explainData(positioned_friend, err);

        expect(problems)
          .to.be.an("array")
          .and.have.length(2);

        // problem with position spec
        expect(problems)
          .to.have.deep.nested.property("[0].via")
          .that.deep.equals([
            "positioned or friend",
            "positioned",
            "positioned",
            "Keys(positioned)"
          ]);
        expect(problems)
          .to.have.deep.nested.property("[0].path")
          .that.deep.equals(["lon"]);
        expect(problems)
          .to.have.deep.nested.property("[0].predicate")
          .that.is.a("function");
        expect(problems)
          .to.have.deep.nested.property("[0].value")
          .that.equals(err);

        // problem with friend spec
        expect(problems)
          .to.have.deep.nested.property("[1].via")
          .that.deep.equals([
            "positioned or friend",
            "friend",
            "named",
            "isString"
          ]);
        expect(problems)
          .to.have.deep.nested.property("[1].path")
          .that.deep.equals(["name"]);
        expect(problems)
          .to.have.deep.nested.property("[1].predicate")
          .that.is.a("function");
        expect(problems)
          .to.have.deep.nested.property("[1].value")
          .that.equals(err.name);
      });
    });
  });

  describe("conform", () => {
    it("works on predicates", () => {
      expect(big_even.conform("1002"), "not an int").to.equal(invalid);
      expect(big_even.conform(1000), "not big, but even").to.deep.equal([
        "even",
        1000
      ]);
      expect(big_even.conform(1001), "not even, but big").to.deep.equal([
        "big",
        1001
      ]);
      expect(big_even.conform(1002), "both").to.deep.equal(["even", 1002]);
      expect(big_even.conform(999), "neither").to.equal(invalid);
    });

    it("works on specs", () => {
      const luis = {
        name: "luis",
        lat: 13,
        lon: 54
      };
      expect(
        positioned_friend.conform(luis),
        "conforms to both specs"
      ).to.deep.equal(["positioned", luis]);

      const anon = {
        lat: 13,
        lon: 54
      };
      expect(
        positioned_friend.conform(anon),
        "not a friend, but positioned"
      ).to.deep.equal(["positioned", anon]);

      const pos = {
        name: "chris",
        lat: 13
      };
      expect(
        positioned_friend.conform(pos),
        "not positioned, but a friend"
      ).to.deep.equal(["friend", pos]);

      expect(
        positioned_friend.conform({
          name: 13,
          lat: "berlin"
        }),
        "violates both specs"
      ).to.equal(invalid);
    });
  });
});
