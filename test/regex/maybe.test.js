import { maybeImpl as maybe, catImpl as cat } from '../../lib/regex'
import map from '../../lib/spec/map'
import { conform, valid } from '../../lib/util'
import { invalid } from '../../lib/symbols'
import { expect } from 'chai'
import { define } from '../../lib/registry'
import { explainData } from '../../index'
import * as p from '../../lib/predicates'

const maybe_ingredient = maybe("ingredient", cat("quantity", p.number, "unit", p.string))

describe('maybe', () => {
  describe('conform', () => {
    it('works in happy case', () => {
      expect(conform(maybe_ingredient), "no value").to.deep.equal({
        ingredient: null
      })
      expect(conform(maybe_ingredient, []), "empty array").to.deep.equal({
        ingredient: null
      })
      expect(conform(maybe_ingredient, [5, "spoons"]), "value").to.deep.equal({
        ingredient: {
          unit: "spoons",
          quantity: 5
        }
      })
    })

    it('works in nested case', () => {
      const ingredient = cat("quantity", maybe("value", p.number), "unit", maybe("value", p.string))
      expect(conform(ingredient, [])).to.deep.equal({
        quantity: {
          value: null
        },
        unit: {
          value: null
        }
      })
    })
  })
})
