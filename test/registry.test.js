import { expect } from 'chai'
import { map } from '../lib/spec/map'
import { define, get, _clear } from '../lib/registry'

describe("registry", () => {
  describe("define and get", () => {
    it("adds a spec to the registry and gets it back", () => {
      const id = Symbol()
      const spec = {}
      define(id, spec)
      const actual = get(id)
      expect(actual).to.equal(spec)
    })

    it("gets an entry with a non-Symbol id and returns undefined", () => {
      const actual = get("string")
      expect(actual).to.be.undefined
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
