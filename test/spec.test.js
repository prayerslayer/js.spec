import { expect } from 'chai'
import { explain, define, conform, valid, _undefineAll } from '../lib/spec'
import * as p from '../lib/predicates'

describe("spec", () => {

  describe("_undefineAll", () => {
    it("nulls all keys in spec registry", () => {
      const SPEC = Symbol()
      define(SPEC, p.number)
      _undefineAll()
      expect(() => conform(SPEC, 40)).to.throw
    })
  })


  describe("conform", () => {
    beforeEach(() => {
      _undefineAll()
    })

    it("throws if spec is not registered", () => {
      expect(() => conform(Symbol(), 40)).to.throw
    })

    it("works with predicates directly", () => {
      expect(conform(p.number, 40)).to.equal(40)
    })

    it("works with predicate registry", () => {
      const SPEC = Symbol()
      define(SPEC, p.number)
      expect(conform(SPEC, 40)).to.equal(40)
    })

    it("works on maps", () => {
      const friendSpec = {
        name: p.string,
        phone: p.or(p.int, p.string),
        [p.optional]: {
          town: p.string
        }
      }
      const dolph = {
        name: "dolph",
        phone: "+49 175 134081580"
      }
      expect(valid(friendSpec, dolph), "dolph").to.be.true
    })
  })
})
