import { expect } from 'chai'
import {
  zeroOrMoreImpl as zeroOrMore,
  catImpl as cat,
  altImpl as alt
} from '../../lib/regex'
import map from '../../lib/spec/map'
import nilable from '../../lib/spec/nilable'
import { conform, valid } from '../../lib/util'
import { invalid } from '../../lib/symbols'
import { define } from '../../lib/registry'
import { explainData, explain } from '../../index'
import * as p from '../../lib/predicates'

describe.only('zeroOrMore', () => {
  /*
        star nil [] nil
        star [] [] nil
        star [:k] [:k] nil
        star [:k1 :k2] [:k1 :k2] nil
        star [:k1 :k2 "x"] ::s/invalid '[{:pred keyword?, :val "x" :via []}]
        star ["a"] ::s/invalid '[{:pred keyword?, :val "a" :via []}]
   */

  it('no value', () => {
    expect(conform(zeroOrMore(p.int))).to.eql([]);
    expect(conform(zeroOrMore(p.int), null)).to.eql([]);
    expect(conform(zeroOrMore(p.int), undefined)).to.eql([]);
  });

  it('empty array', () => {
    expect(conform(zeroOrMore(p.int), [])).to.eql([]);
  });

  it('single correct value', () => {
    expect(conform(zeroOrMore(p.int), [42])).to.eql([42]);
  });

  it('multiple correct values', () => {
    expect(conform(zeroOrMore(p.int), [42, 21])).to.eql([42, 21]);
  });

  it('multiple incorrect values', () => {
    expect(conform(zeroOrMore(p.int), [42, 21, 'x'])).to.eql(invalid);
    const a = explainData(zeroOrMore(p.int), [42, 21, 'x'])
    expect(a[0].predicate).to.eql(p.int);
    expect(a[0].path).to.eql([2]);
    expect(a[0].via).to.eql([]);
    expect(a[0].value).to.eql('x');
  });

  it('single incorrect value', () => {
    expect(conform(zeroOrMore(p.int), ['x'])).to.eql(invalid);
    const a = explainData(zeroOrMore(p.int), ['x'])
    expect(a[0].predicate).to.eql(p.int);
    expect(a[0].path).to.eql([0]);
    expect(a[0].via).to.eql([]);
    expect(a[0].value).to.eql('x');
  });
});
