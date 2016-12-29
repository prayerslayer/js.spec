import { catImpl as cat, altImpl as alt } from '../../lib/regex'
import map from '../../lib/spec/map'
import { conform, valid } from '../../lib/util'
import { invalid } from '../../lib/symbols'
import { expect } from 'chai'
import { define } from '../../lib/registry'
import * as p from '../../lib/predicates'

describe("alt", () => {
  const ingredient_part = alt("quantity", p.number, "unit", p.string)
  const ingredient_variation = alt("regular", cat("quantity", p.number, "unit", p.string), "reversed", cat("unit", p.string, "quantity", p.number))

  it("throws when odd number of args provided", () => {
    expect(() => alt("foo")).to.throw()
  })

  it("is valid", () => {
    expect(valid(ingredient_part, 5)).to.be.true
    expect(valid(ingredient_part, "spoons")).to.be.true
  })

  it("works with symbol tags", () => {
    const quantity = Symbol()
    const part = alt(quantity, p.number, "unit", p.string)
    expect(conform(part, 4)).to.deep.equal({
      [quantity]: 4
    })
    expect(conform(part, "spoons")).to.deep.equal({
      unit: "spoons"
    })
  })

  it("works with specs", () => {
    const userOrPwd = alt("user", map({
      name: p.string
    }), "password", p.string)
    expect(conform(userOrPwd, {
      name: "john"
    })).to.deep.equal({
      user: {
        name: "john"
      }
    })
    expect(conform(userOrPwd, "secret")).to.deep.equal({
      password: "secret"
    })
  })

  it("works with spec refs", () => {
    const user = Symbol()
    define(user, map({
      name: p.string
    }))
    const userOrPwd = alt("user", user, "password", p.string)
    expect(conform(userOrPwd, [{
      name: "john"
    }])).to.deep.equal({
      user: {
        name: "john"
      }
    })
    expect(conform(userOrPwd, "secret")).to.deep.equal({
      password: "secret"
    })
  })

  it("works in happy case", () => {
    expect(conform(ingredient_part, 5)).to.deep.equal({
      quantity: 5
    })
    expect(conform(ingredient_part, "spoons")).to.deep.equal({
      unit: "spoons"
    })
  })

  it("works in negative case (not matching preds)", () => {
    expect(conform(ingredient_part, false)).to.equal(invalid)
  })

  it("works in negative case (too few items)", () => {
    expect(conform(ingredient_part, [])).to.equal(invalid)
  })

  it("works with too many items provided", () => {
    expect(conform(ingredient_part, [5, "spoons", "tops"])).to.deep.equal({
      quantity: 5
    })
  })

  it("works in happy nested case", () => {
    expect(conform(ingredient_variation, [5, "spoons"]), "regular").to.deep.equal({
      regular: {
        quantity: 5,
        unit: "spoons"
      }
    })
    expect(conform(ingredient_variation, ["spoons", 5]), "reversed").to.deep.equal({
      reversed: {
        quantity: 5,
        unit: "spoons"
      }
    })
  })

  it("works in negative nested case", () => {
    expect(conform(ingredient_variation, [false, "spoons"])).to.equal(invalid)
    expect(conform(ingredient_variation, [5, false])).to.equal(invalid)
    expect(conform(ingredient_variation, [5])).to.equal(invalid)
  })
})
