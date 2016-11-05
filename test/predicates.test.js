import { expect } from 'chai'
import * as p from '../lib/predicates'

describe("predicate", () => {
  describe("number", () => {
    [-10, 0, 10, 20000, 3.14, 1 / 2, Infinity, -Infinity].forEach(nr => it(`returns true for ${nr}`, () => {
      expect(p.number(nr)).to.be.true
    }))
  })

  describe("or", () => {
    it("returns false if no predicates were provided", () => {
      expect(p.or()()).to.be.false
    })
    it("returns true if one predicate returns true", () => {
      const stringOrInt = p.or(p.string, p.int)
      expect(stringOrInt(5), "integer").to.be.true
      expect(stringOrInt("five"), "string").to.be.true
    })
    it("returns false if all predicates return false", () => {
      const stringOrInt = p.or(p.string, p.int)
      expect(stringOrInt(true)).to.be.false
    })
  })

  describe("and", () => {
    it("returns true if no predicates were provided", () => {
      expect(p.and()()).to.be.true
    })
    it("returns false if one predicate returns false", () => {
      const bigInt = p.and(p.int, x => x > 1000)
      expect(bigInt(10), "small").to.be.false
      expect(bigInt("100000"), "not int").to.be.false
    })
    it("returns true if all predicates return true", () => {
      const bigInt = p.and(p.int, x => x > 1000)
      expect(bigInt(10000)).to.be.true
    })
  })
})
