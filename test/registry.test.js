import { expect } from 'chai'
import { define, get } from '../lib/registry'
import * as p from '../lib/predicates'
import { specize } from '../lib/util';

describe("registry", () => {
  describe("define and get", () => {
    it("adds a spec to the registry and gets it back", () => {
      const id = Symbol()
      const spec = specize(p.int)
      define(id, spec)
      const actual = get(id)
      expect(actual).to.equal(spec)
    })

    it("defines an alias to another defined spec and gets the aliased spec back", () => {
      const id = "id"
      const spec = specize(p.negative)
      define(id, spec)
      const alias = "alias"
      define(alias, id)
      const actual = get(alias)
      expect(actual).to.equal(spec)
    })

    it("uses numbers as spec IDs", () => {
      const id = 1
      const spec = specize(p.string)
      define(id, spec)
      const actual = get(id)
      expect(actual).to.equal(spec)
    })

    it("treats string and symbol IDs as equivalent", () => {
      const id = "string"
      const spec = specize(p.int)
      define(id, spec)
      const actual = get(Symbol.for(id))
      expect(actual).to.equal(spec)
    })

    it("overwrites already-defined specs with same ID", () => {
      const id = Symbol()
      const spec = specize(p.int)
      define(id, spec)
      const spec2 = specize(p.string)
      define(id, spec2)
      const actual = get(id)
      expect(actual).to.not.equal(spec)
      expect(actual).to.equal(spec2)

    })

    it("getting a nonexistent entry returns undefined", () => {
      const actual = get("42")
      expect(actual).to.be.undefined
    })

    it("converts function predicates to specs", () => {
      const id = Symbol.for("id")
      define(id, p.string)
      const expected = specize(p.string)
      expected.name = "id"
      const actual = get(id)
      expect(actual).to.deep.equal(expected)
    })
  })
/*
This test causes map.test to fail because it clears the registry
before the generated tests for "works on spec aliases" therein are executed.
I am leaving this test here, commented out, to save someone else's frustration
if they decide to add a test for _clear.

  describe("_clear", () => {
    it("clears the registry of defined specs", () => {
      const id = Symbol()
      const spec = {}
      define(id, spec)
      let actual = get(id)
      expect(actual).to.equal(spec)
      _clear()
      actual = get(id)
      expect(actual).to.be.undefined
    })
  })
*/
})
