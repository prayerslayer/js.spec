import { expect } from 'chai'
import tuple from '../../lib/spec/tuple'
import * as p from '../../lib/predicates'
import { invalid } from '../../lib/symbols'
import { define, _clear } from '../../lib/registry'

describe("tuple", () => {
  describe("conform", () => {
    it("works with predicates", () => {
      const t = tuple(p.int, p.int)

      expect(t.conform([5, 5]), "happy case").to.deep.equal([5, 5])
      expect(t.conform([5]), "not enough values").to.equal(invalid)
      expect(t.conform([5, 5, 5]), "too many values").to.equal(invalid)
      expect(t.conform(["string", 5]), "value type mismatch").to.equal(invalid)
      expect(t.conform("string"), "not an array").to.equal(invalid)
    })

    it("works with specs", () => {
      const point = tuple(p.int, p.int)
      const line = tuple(point, point)

      expect(line.conform([[0, 0], [0, 0]]), "happy case").to.deep.equal([[0, 0], [0, 0]])
      expect(line.conform([[0, 0]]), "not enough values").to.equal(invalid)
      expect(line.conform([[0, 0], [0, 0], [0, 0]]), "too many values").to.equal(invalid)
      expect(line.conform([[0, 0], "string"]), "line value type mismatch").to.equal(invalid)
      expect(line.conform([[0, 0], [0, "0"]]), "point value type mismatch").to.equal(invalid)
      expect(line.conform("string"), "not an array").to.equal(invalid)
    })

    it("works with spec aliases", () => {
      const point = Symbol("point")
      define(point, tuple(p.int, p.int))
      const line = tuple(point, point)

      expect(line.conform([[0, 0], [0, 0]]), "happy case").to.deep.equal([[0, 0], [0, 0]])
      expect(line.conform([[0, 0]]), "not enough values").to.equal(invalid)
      expect(line.conform([[0, 0], [0, 0], [0, 0]]), "too many values").to.equal(invalid)
      expect(line.conform([[0, 0], "string"]), "line value type mismatch").to.equal(invalid)
      expect(line.conform([[0, 0], [0, "0"]]), "point value type mismatch").to.equal(invalid)
      expect(line.conform("string"), "not an array").to.equal(invalid)
    })

    after(() => {
      _clear()
    })
  })

  describe("explain", () => {
    it("works with predicates", () => {
      const t = tuple(p.int, p.int)
      const path = []
      const via = []

      expect(t.explain(path, via, [0, 0]), "happy case").to.deep.equal([null, null])

      const notAnArray = t.explain(path, via, "string")
      expect(notAnArray).to.be.an("array").and.to.have.length(1)
      expect(notAnArray[0], "notAnArray").to.have.keys("path", "via", "predicate", "predicateName", "value")
      expect(notAnArray[0], "notAnArray").to.have.property("path", path)
      expect(notAnArray[0], "notAnArray").to.have.property("via", via)
      expect(notAnArray[0], "notAnArray").to.have.property("value", "string")
      expect(notAnArray[0], "notAnArray").to.have.property("predicateName", "isArray")
      expect(notAnArray[0].predicate, "notAnArray").to.be.a("function")

      const missingValue = t.explain(path, via, [0])
      expect(missingValue).to.be.an("array").and.to.have.length(1)
      expect(missingValue[0], "missingValue").to.have.keys("path", "via", "predicate", "predicateName", "value")
      expect(missingValue[0], "missingValue").to.have.property("path", path)
      expect(missingValue[0], "missingValue").to.have.property("via", via)
      expect(missingValue[0], "missingValue").to.have.property("predicateName", "equals 2")
      expect(missingValue[0].value, "missingValue").to.deep.equal([0])
      expect(missingValue[0].predicate, "missingValue").to.be.a("function")

      const extraValue = t.explain(path, via, [0, 0, 0])
      expect(extraValue, "extraValue").to.be.an("array").and.to.have.length(1)
      expect(extraValue[0], "extraValue").to.have.keys("path", "via", "predicate", "predicateName", "value")
      expect(extraValue[0], "extraValue").to.have.property("path", path)
      expect(extraValue[0], "extraValue").to.have.property("via", via)
      expect(extraValue[0], "extraValue").to.have.property("predicateName", "equals 2")
      expect(extraValue[0].value, "extraValue").to.deep.equal([0, 0, 0])
      expect(extraValue[0].predicate, "extraValue").to.be.a("function")

      const wrongValue = t.explain(path, via, ["0", 0])
      expect(wrongValue, "wrongValue").to.be.an("array").and.to.have.length(2)
      expect(wrongValue[0], "wrongValue").to.have.keys("path", "via", "predicate", "predicateName", "value")
      expect(wrongValue[0], "wrongValue").to.have.property("predicateName", "isInteger")
      expect(wrongValue[0].path, "wrongValue").to.deep.equal([0])
      expect(wrongValue[0].via, "wrongValue").to.deep.equal(["Tuple(isInteger, isInteger)"])
      expect(wrongValue[0].value, "wrongValue").to.deep.equal("0")
      expect(wrongValue[0].predicate, "wrongValue").to.be.a("function")
    })

    it("works with specs", () => {
      const point = tuple(p.int, p.int)
      const line = tuple(point, point)
      const path = []
      const via = []

      expect(line.explain(path, via, [[0, 0], [0, 0]]), "happy case").to.deep.equal([null, null])

      const missingValue = line.explain(path, via, [[0, 0]])
      expect(missingValue[0], "missingValue").to.have.keys("path", "via", "predicate", "predicateName", "value")
      expect(missingValue[0], "missingValue").to.have.property("path", path)
      expect(missingValue[0], "missingValue").to.have.property("via", via)
      expect(missingValue[0], "missingValue").to.have.property("predicateName", "equals 2")
      expect(missingValue[0].value, "missingValue").to.deep.equal([[0, 0]])
      expect(missingValue[0].predicate, "missingValue").to.be.a("function")

      const wrongValue = line.explain(path, via, [[0, 0], ["0", 0]])
      expect(wrongValue, "wrongValue").to.be.an("array").and.to.have.length(3)
      expect(wrongValue[0], "wrongValue").to.equal(null)
      expect(wrongValue[1], "wrongValue").to.have.keys("path", "via", "predicate", "predicateName", "value")
      expect(wrongValue[1], "wrongValue").to.have.property("predicateName", "isInteger")
      expect(wrongValue[1].via, "wrongValue").to.deep.equal([
        "Tuple(Tuple(isInteger, isInteger), Tuple(isInteger, isInteger))",
        "Tuple(isInteger, isInteger)"
      ])
      expect(wrongValue[1].path, "wrongValue").to.deep.equal([1, 0])
      expect(wrongValue[1].value, "wrongValue").to.deep.equal("0")
      expect(wrongValue[1].predicate, "wrongValue").to.be.a("function")
    })

    it("works with specs aliases", () => {
      const point = Symbol("Point")
      define(point, tuple(p.int, p.int))
      const line = tuple(point, point)
      const path = []
      const via = []

      expect(line.explain(path, via, [[0, 0], [0, 0]]), "happy case").to.deep.equal([null, null])

      const missingValue = line.explain(path, via, [[0, 0]])
      expect(missingValue[0], "missingValue").to.have.keys("path", "via", "predicate", "predicateName", "value")
      expect(missingValue[0], "missingValue").to.have.property("path", path)
      expect(missingValue[0], "missingValue").to.have.property("via", via)
      expect(missingValue[0], "missingValue").to.have.property("predicateName", "equals 2")
      expect(missingValue[0].value, "missingValue").to.deep.equal([[0, 0]])
      expect(missingValue[0].predicate, "missingValue").to.be.a("function")

      const wrongValue = line.explain(path, via, [[0, 0], ["0", 0]])
      expect(wrongValue, "wrongValue").to.be.an("array").and.to.have.length(3)
      expect(wrongValue[0], "wrongValue").to.equal(null)
      expect(wrongValue[1], "wrongValue").to.have.keys("path", "via", "predicate", "predicateName", "value")
      expect(wrongValue[1], "wrongValue").to.have.property("predicateName", "isInteger")
      expect(wrongValue[1].via, "wrongValue").to.deep.equal([
        "Tuple(Point, Point)",
        "Point"
      ])
      expect(wrongValue[1].path, "wrongValue").to.deep.equal([1, 0])
      expect(wrongValue[1].value, "wrongValue").to.deep.equal("0")
      expect(wrongValue[1].predicate, "wrongValue").to.be.a("function")
    })
  })
})
