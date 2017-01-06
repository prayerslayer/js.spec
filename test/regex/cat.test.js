import { expect } from 'chai'
import { catImpl as cat, altImpl as alt } from '../../lib/regex'
import map from '../../lib/spec/map'
import nilable from '../../lib/spec/nilable'
import { conform, valid } from '../../lib/util'
import { invalid } from '../../lib/symbols'
import { define } from '../../lib/registry'
import { explainData } from '../../index'
import * as p from '../../lib/predicates'

const ingredient = cat("quantity", p.number, "unit", p.string)
const weak_ingredient = cat("quantity", alt("str", p.string, "int", p.number), "unit", alt("str", p.string, "int", p.number))

describe("cat", () => {

  it("throws when odd number of args provided", () => {
    expect(() => cat("foo")).to.throw()
  })

  describe("conform", () => {
    it("is valid", () => {
      expect(valid(ingredient, [5, "spoons"])).to.be.true
    })

    it("works with symbol tags", () => {
      const quantity = Symbol()
      const i = cat(quantity, p.number, "unit", p.string)
      expect(conform(i, [4, "spoons"])).to.deep.equal({
        [quantity]: 4,
        "unit": "spoons"
      })
    })

    it("works with specs", () => {
      const i = cat("user", map({
        name: p.string
      }), "password", p.string)
      expect(conform(i, [{
        name: "john"
      }, "secret"])).to.deep.equal({
        "user": {
          name: "john"
        },
        "password": "secret"
      })
    })

    it("works with spec refs", () => {
      const user = Symbol()
      define(user, map({
        name: p.string
      }))
      const i = cat("user", user, "password", p.string)
      expect(conform(i, [{
        name: "john"
      }, "secret"])).to.deep.equal({
        "user": {
          name: "john"
        },
        "password": "secret"
      })

      const reverse = cat("password", p.string, "user", user)
      expect(conform(reverse, ["secret", {
        name: "john"
      }])).to.deep.equal({
        "user": {
          name: "john"
        },
        "password": "secret"
      })
      expect(conform(reverse, [{
        name: "john"
      }, "secret"])).to.equal(invalid)
    })

    it("works in happy case", () => {
      expect(conform(ingredient, [5, "spoons"])).to.deep.equal({
        quantity: 5,
        unit: "spoons"
      })
    })

    it("works with nilable parts", () => {
      // what if the spec, but not the regex accepts nil value?
      const can_be_nil = nilable(map({
        quantity: p.number,
        unit: p.string
      }))
      // expect(conform(can_be_nil)).to.deep.equal(undefined)
      const nil_and_something = cat("something", p.string, "maybe nil", can_be_nil)
      // console.log(explainData(nil_and_something, ["foo"]))
      expect(conform(nil_and_something, ["foo"])).to.deep.equal({
        something: "foo",
        "maybe nil": null
      })
    })

    it("works in negative case (not matching preds)", () => {
      expect(conform(ingredient, ["5", "spoons"])).to.equal(invalid)
    })

    it("works in negative case (too few items)", () => {
      expect(conform(ingredient, [5])).to.equal(invalid)
    })

    it("works with too many items provided", () => {
      expect(conform(ingredient, [5, "spoons", "tops"])).to.deep.equal({
        quantity: 5,
        unit: "spoons"
      })
    })

    it("works in happy nested case", () => {
      expect(conform(weak_ingredient, [5, "spoons"])).to.deep.equal({
        "quantity": {
          "int": 5
        },
        "unit": {
          "str": "spoons"
        }
      })
      expect(conform(weak_ingredient, ["5", "spoons"])).to.deep.equal({
        "quantity": {
          "str": "5"
        },
        "unit": {
          "str": "spoons"
        }
      })
    })

    it("works in negative nested case", () => {
      expect(conform(weak_ingredient, [false, "spoons"])).to.equal(invalid)
      expect(conform(weak_ingredient, [5, false])).to.equal(invalid)
      expect(conform(weak_ingredient, [5])).to.equal(invalid)
    })
  })

  describe("explain", () => {
    it("[happy case]", () => {
      const problems = explainData(weak_ingredient, ["spoons", 5])
      expect(problems).to.be.an("array").and.to.have.length(0)
    })

    it("[too many values]", () => {
      const problems = explainData(weak_ingredient, ["spoons", 5, 5])
      expect(problems).to.be.an("array").and.to.have.length(0)
    })

    it("[too few values, but it's ok]", () => {
      const regular = alt("str", p.string, "int", p.number)
      const nilable_named_ingredient = cat("name", p.string, "ingredient", alt("data", regular, "none", p.nil))
      const problems = explainData(nilable_named_ingredient, ["endless void"])

      expect(problems).to.be.an("array").and.to.have.length(0)
    })

    it("[too few values, not ok]", () => {
      const problems = explainData(weak_ingredient, ["spoons"])

      expect(problems).to.be.an("array").and.to.have.length(1)
      expect(problems)
        .to.have.deep.property("[0].predicate")
        .that.is.a("function")
      expect(problems)
        .to.have.deep.property("[0].path")
        .that.is.an("array")
        .and.deep.equals([])
      expect(problems)
        .to.have.deep.property("[0].via")
        .that.is.an("array")
        .and.deep.equals(["cat ·"])
      expect(problems)
        .to.have.deep.property("[0].value")
        .that.deep.equals(["spoons"])
    })

    it("[wrong predicate]", () => {
      const problems = explainData(weak_ingredient, ["spoons", false])

      expect(problems).to.be.an("array").and.to.have.length(1)
      expect(problems)
        .to.have.deep.property("[0].predicate")
        .that.is.a("function")
      expect(problems)
        .to.have.deep.property("[0].path")
        .that.is.an("array")
        .and.deep.equals([1])
      expect(problems)
        .to.have.deep.property("[0].via")
        .that.is.an("array")
        .and.deep.equals(["cat ·", "unit"])
      expect(problems)
        .to.have.deep.property("[0].value")
        .that.deep.equals(false)
    })
  })
})
