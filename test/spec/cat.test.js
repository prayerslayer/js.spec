import { expect } from 'chai'
import cat from '../../lib/spec/cat'
import * as p from '../../lib/predicates'
import { explainData } from '../../lib/util'
import { invalid, optional } from '../../lib/symbols'
import { define, _clear } from '../../lib/registry'

describe("cat", () => {
  it("does not throw", () => {
    const ingredient = cat("quantity", p.number, "unit", p.string)
    expect(ingredient.conform([5, "spoons"])).to.deep.equal({
      quantity: 5,
      unit: "spoons"
    })
  })
})
