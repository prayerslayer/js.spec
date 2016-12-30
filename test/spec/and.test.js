import { expect } from 'chai'
import and from '../../lib/spec/and'
import map from '../../lib/spec/map'
import * as p from '../../lib/predicates'
import { explainData } from '../../index'
import { invalid, optional } from '../../lib/symbols'
import { define, _clear } from '../../lib/registry'

const friend = map({
  name: p.string
})
const positioned = map({
  lat: p.number,
  lon: p.number
})
const positioned_friend = and(positioned, friend)
const big_even = and(p.int, p.even, x => x > 1000)

describe("and", () => {
  describe("explain", () => {
    describe("works on specs", () => {
      it("[not a friend]", () => {
        const value = {
          lat: 13,
          lon: 54
        }
        const problems = explainData(positioned_friend, value)

        expect(problems).to.be.an("array")
          .and.have.length(1)
        expect(problems).to.have.deep.property("[0].via")
          .that.deep.equals([
          "And(Map, Map)",
          "Map",
          "Keys(name)"
        ])
        expect(problems).to.have.deep.property("[0].path")
          .that.deep.equals(["name"])
        expect(problems).to.have.deep.property("[0].predicate")
          .that.is.a("function")
        expect(problems).to.have.deep.property("[0].value")
          .that.equals(value)
      })

      it("[not positioned]", () => {
        const value = {
          name: "valerie",
          lat: 13
        }
        const problems = explainData(positioned_friend, value)

        expect(problems).to.be.an("array")
          .and.have.length(1)
        expect(problems).to.have.deep.property("[0].via")
          .that.deep.equals([
          "And(Map, Map)",
          "Map",
          "Keys(lat, lon)"
        ])
        expect(problems).to.have.deep.property("[0].path")
          .that.deep.equals(["lon"])
        expect(problems).to.have.deep.property("[0].predicate")
          .that.is.a("function")
        expect(problems).to.have.deep.property("[0].value")
          .that.equals(value)
      })

      it("[neither]", () => {
        const value = {
          name: 13,
          lat: "fifty"
        }
        const problems = explainData(positioned_friend, value)

        expect(problems).to.be.an("array")
          .and.have.length(1)
        expect(problems).to.have.deep.property("[0].via")
          .that.deep.equals([
          "And(Map, Map)",
          "Map",
          "Keys(lat, lon)"
        ])
        expect(problems).to.have.deep.property("[0].path")
          .that.deep.equals(["lon"])
        expect(problems).to.have.deep.property("[0].predicate")
          .that.is.a("function")
        expect(problems).to.have.deep.property("[0].value")
          .that.equals(value)
      })
    })

    describe("works on predicates", () => {
      it("[not an int]", () => {
        const problems = explainData(big_even, "1002")
        expect(problems).to.be.an("array")
          .and.have.length(1)
        expect(problems).to.have.deep.property("[0].via")
          .that.deep.equals([
          "And(isInteger, even, [anonymous predicate])",
          "isInteger"
        ])
        expect(problems).to.have.deep.property("[0].path")
          .that.deep.equals([])
        expect(problems).to.have.deep.property("[0].predicate")
          .that.is.a("function")
        expect(problems).to.have.deep.property("[0].value")
          .that.equals("1002")
      })

      it("[not big]", () => {
        const problems = explainData(big_even, 1000)
        expect(problems).to.be.an("array")
          .and.have.length(1)
        expect(problems).to.have.deep.property("[0].via")
          .that.deep.equals([
          "And(isInteger, even, [anonymous predicate])",
          "[anonymous predicate]"
        ])
        expect(problems).to.have.deep.property("[0].path")
          .that.deep.equals([])
        expect(problems).to.have.deep.property("[0].predicate")
          .that.is.a("function")
        expect(problems).to.have.deep.property("[0].value")
          .that.equals(1000)
      })

      it("[not even]", () => {
        const problems = explainData(big_even, 1001)
        expect(problems).to.be.an("array")
          .and.have.length(1)
        expect(problems).to.have.deep.property("[0].via")
          .that.deep.equals([
          "And(isInteger, even, [anonymous predicate])",
          "even"
        ])
        expect(problems).to.have.deep.property("[0].path")
          .that.deep.equals([])
        expect(problems).to.have.deep.property("[0].predicate")
          .that.is.a("function")
        expect(problems).to.have.deep.property("[0].value")
          .that.equals(1001)
      })
    })
  })
  describe("conform", () => {
    it("works on predicates", () => {
      expect(big_even.conform("1002"), "not an int").to.equal(invalid)
      expect(big_even.conform(1000), "not big").to.equal(invalid)
      expect(big_even.conform(1001), "not even").to.equal(invalid)
      expect(big_even.conform(1002), "big even").to.equal(1002)
    })

    it("works on specs", () => {
      const luis = {
        name: "luis",
        lat: 13,
        lon: 54
      }
      expect(positioned_friend.conform(luis),
        "conforms to both specs")
        .to.deep.equal(luis)

      expect(positioned_friend.conform({
        lat: 13,
        lon: 54
      }),
        "violates friend spec")
        .to.equal(invalid)

      expect(positioned_friend.conform({
        name: "chris",
        lat: 13
      }),
        "violates positioned spec")
        .to.equal(invalid)

      expect(positioned_friend.conform({
        name: 13,
        lat: "berlin"
      }),
        "violates both specs")
        .to.equal(invalid)
    })
  })
})
