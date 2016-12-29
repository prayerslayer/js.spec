import { expect } from 'chai'
import { zip } from '../lib/util'

describe("util", () => {
  describe("zip", () => {
    it("is reversible", () => {
      const colls = [[1, 2, 3], [4, 5, 6]]
      expect(colls).to.deep.equal(zip(...zip(...colls)))
    })
  })
})
