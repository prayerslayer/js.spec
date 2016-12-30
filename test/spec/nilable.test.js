import { expect } from 'chai'
import nilable from '../../lib/spec/nilable'
import map from '../../lib/spec/map'
import * as p from '../../lib/predicates'
import { invalid } from '../../lib/symbols'
import { explainData } from '../../index'
import { define, _clear } from '../../lib/registry'

const friend = map({
  name: p.string
})
const nil_friend = nilable(friend)
const nil_int = nilable(p.int)

describe("tuple", () => {
  describe("explain", () => {
    describe("works on specs", () => {
      it("[not null and not a friend]", () => {
        const f = {
          name: 3000
        }
        const problems = explainData(nil_friend, f)
        expect(problems).to.be.an("array").and.have.length(1)
        expect(problems).to.have.deep.property("[0].via")
          .that.deep.equals(["Nilable(Map)", "Map", "isString"])
        expect(problems).to.have.deep.property("[0].path")
          .that.deep.equals(["name"])
        expect(problems).to.have.deep.property("[0].predicate")
          .that.is.a("function")
        expect(problems).to.have.deep.property("[0].value")
          .that.deep.equals(f)
      })
    })
  })
  describe("conform", () => {
    it("works on predicates", () => {
      expect(nil_int.conform(null), "null").to.equal(null)
      expect(nil_int.conform(undefined), "undefined").to.equal(undefined)
      expect(nil_int.conform(), "undefined 2").to.equal(undefined)
      expect(nil_int.conform(13), "int").to.equal(13)
      expect(nil_int.conform("13"), "string").to.equal(invalid)
    })

    it("works on specs", () => {
      expect(nil_friend.conform(null), "null").to.equal(null)
      expect(nil_friend.conform(undefined), "undefined").to.equal(undefined)
      expect(nil_friend.conform(), "undefined 2").to.equal(undefined)
      expect(nil_friend.conform({
        name: "niko"
      }), "friend").to.deep.equal({
        name: "niko"
      })
      expect(nil_friend.conform({
        name: 3000
      })).to.equal(invalid)
    })
  })
})
