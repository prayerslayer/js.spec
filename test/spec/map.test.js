import { expect } from 'chai'
import map from '../../lib/spec/map'
import * as p from '../../lib/predicates'
import { invalid, optional } from '../../lib/symbols'
import { define, _clear } from '../../lib/registry'

function generateTests(testData, expectFn) {
  testData.forEach(test => it(`[${test.message}]`, () => {
    if (test.expectedValid) {
      expect(expectFn(test), test.message).to.deep.equal(test.value)
    } else {
      expect(expectFn(test), test.message).to.equal(invalid)
    }
  }))
}

describe("map", () => {
  describe("conform", () => {

    describe("works on nested maps", () => {
      const school = map({
        district: p.string
      })
      const friend = map({
        name: p.string,
        school
      })

      const TEST_DATA = [{
        value: {
          name: "holger",
          school: {
            district: "xhain"
          }
        },
        message: "happy case",
        expectedValid: true
      }, {
        value: {
          name: "holger",
          school: {
            district: 9
          }
        },
        message: "invalid nested key",
        expectedValid: false
      }, {
        value: {
          name: "holger",
          school: {}
        },
        message: "missing required nested key",
        expectedValid: false
      }, {
        value: {
          name: "holger",
          university: {
            district: "xhain"
          }
        },
        message: "wrong required nested key",
        expectedValid: false
      }]

      generateTests(TEST_DATA, (test) => friend.conform(test.value))

    })

    describe("works on flat maps", () => {
      const spec = map({
        name: p.string,
        [optional]: {
          phone: p.string
        }
      })
      const TEST_DATA = [
        {
          message: "conform required, no optional",
          value: {
            name: 'holger'
          },
          expectedValid: true
        }, {
          message: "invalid required",
          value: {
            name: 3000
          },
          expectedValid: false
        }, {
          message: "conform required, conform optional",
          value: {
            name: 'holger',
            phone: '1234'
          },
          expectedValid: true
        }, {
          message: "conform required, invalid optional",
          value: {
            name: 'holger',
            phone: 301582
          },
          expectedValid: false
        }, {
          message: "missing required",
          value: {
            foo: "bar"
          },
          expectedValid: false
        }, {
          message: "additional keys",
          value: {
            name: "holger",
            bestFriend: false
          },
          expectedValid: true
        }
      ]

      generateTests(TEST_DATA, (test) => spec.conform(test.value))

    })
  })
})
