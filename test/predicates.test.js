import { expect } from 'chai'
import * as p from '../lib/predicates'

describe("predicate", () => {
  describe("number", () => {
    [-10, 0, 10, 20000, 3.14, 1 / 2, Infinity, -Infinity].forEach(nr => it(`returns true for ${nr}`, () => {
      expect(p.number(nr)).to.be.true
    }))
  })
})

/*
 * TODO
 * since most predicates are directly taken from lodash I won't write tests
 * for them just now. however it would beneficial in order to swap implementation
 * later.
 */
