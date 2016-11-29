import { expect } from 'chai'
import oneOf from '../../lib/spec/enum'
import * as p from '../../lib/predicates'
import { invalid } from '../../lib/symbols'
import { explainData } from '../../lib/util'

describe("enum", () => {
  describe("conform", () => {
    it("works with numbers", () => {
      const e = oneOf(1, 2, 3)
      expect(e.conform(1)).to.equal(1)
      expect(e.conform(2)).to.equal(2)
      expect(e.conform(3)).to.equal(3)
      expect(e.conform("3")).to.equal(invalid)
      expect(e.conform(4)).to.equal(invalid)
    })

    it("works with symbols", () => {
      const s1 = Symbol()
      const s2 = Symbol()
      const e = oneOf(s1, s2)

      expect(e.conform(s1)).to.equal(s1)
      expect(e.conform(s2)).to.equal(s2)
      expect(e.conform(Symbol())).to.equal(invalid)
    })
  })

  describe("explain", () => {
    it("outputs expected data", () => {
      const e = oneOf(1, 2, 3)
      const problems = explainData(e, 4)

      expect(problems).to.be.an("array").and.have.length(1)
      expect(problems).to.have.deep.property("[0].via")
        .that.deep.equals(["Enum(1, 2, 3)"])
      expect(problems).to.have.deep.property("[0].path")
        .that.deep.equals([])
      expect(problems).to.have.deep.property("[0].predicate")
        .that.is.a("function")
      expect(problems).to.have.deep.property("[0].value")
        .that.deep.equals(4)
    })
  })
})
