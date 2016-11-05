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

  describe("record", () => {
    const friend = p.record({
      name: p.string,
      phone: p.or(p.int, p.string),
      [p.optional]: {
        town: p.string,
        parents: p.record({
          father: p.string,
          mother: p.string,
          [p.optional]: {
            otherRelatives: p.record({
              aunt: p.string
            })
          }
        })
      }
    })
    it("returns true if optional key is omitted", () => {
      const dolph = {
        name: "dolph",
        phone: "+49 175 134081580"
      }
      expect(friend(dolph), "dolph").to.be.true
    })
    it("returns false if required key is omitted", () => {
      const astrid = {
        name: "astrid",
        town: "stockholm"
      }
      expect(friend(astrid), "astrid").to.be.false
    })
    it("returns false if required key is present, but not conform", () => {
      const holger = {
        name: "holger",
        phone: "1235",
        phone: false
      }
      expect(friend(holger), "holger").to.be.false
    })
    it("returns false if optional key is present, but not conform", () => {
      const recep = {
        name: "recep",
        phone: "1235",
        town: false
      }
      expect(friend(recep), "recep").to.be.false
    })
    it("returns true if there are additional keys", () => {
      const lindsay = {
        name: "lindsay",
        phone: "+0 4525252",
        doesThisMatter: false
      }
      expect(friend(lindsay), "lindsay").to.be.true
    })
    it("works with 1x nested structures", () => {
      const freddy = {
        name: "freddy",
        phone: "+0 4525252",
        parents: {
          mother: "mom",
          father: "pop"
        }
      }
      expect(friend(freddy), "freddy").to.be.true
    })
    it("works with 2x nested structures - happy", () => {
      const lauri = {
        name: "lauri",
        phone: "+0 4525252",
        parents: {
          mother: "mom",
          father: "pop",
          otherRelatives: {
            aunt: "barb"
          }
        }
      }
      expect(friend(lauri), "lauri").to.be.true
    })

    it("works with 2x nested structures - sad", () => {
      const ingo = {
        name: "ingo",
        phone: "+0 4525252",
        parents: {
          mother: "mom",
          father: "pop",
          otherRelatives: {
            aunt: true
          }
        }
      }
      expect(friend(ingo), "ingo").to.be.false
    })
  })
})
