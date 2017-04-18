import { expect } from 'chai'
import {
  kleeneImpl as kleene,
  catImpl as cat,
  altImpl as alt,
  maybeImpl as maybe
} from '../../lib/regex'
import map from '../../lib/spec/map'
import nilable from '../../lib/spec/nilable'
import { conform, valid } from '../../lib/util'
import { invalid } from '../../lib/symbols'
import { define } from '../../lib/registry'
import { explainData, explain, spec } from '../../index'
import * as p from '../../lib/predicates'

describe('kleene', () => {
  it('no value', () => {
    expect(conform(kleene(p.int))).to.eql([]);
    expect(conform(kleene(p.int), null)).to.eql([]);
    expect(conform(kleene(p.int), [null])).to.eql(invalid);
  });

  it('empty array', () => {
    expect(conform(kleene(p.int), [])).to.eql([]);
  });

  it('single correct value', () => {
    expect(conform(kleene(p.int), [42])).to.eql([42]);
  });

  it('with specs', () => {
    expect(conform(kleene(spec.and(p.int, p.even)), [2])).to.eql([2]);
    expect(conform(kleene(spec.and(p.int, p.even)), [3])).to.eql(invalid);

    expect(conform(kleene(spec.or({
      'id': p.int,
      'name': p.string
    })), [2])).to.eql([['id', 2]]);
    expect(conform(kleene(spec.or({
      'id': p.int,
      'name': p.string
    })), [2, 'Barry'])).to.eql([['id', 2],['name', 'Barry']]);
  });

  it('with regexes', () => {
    expect(
      conform(kleene(cat(
        'word1', p.string,
        'id', p.int,
        'word2', p.string
      )), ['hi', 3, 'world'])
    ).to.eql([{
      'word1': 'hi',
      'id': 3,
      'word2': 'world'
    }]);
  });

  it('with nilable', () => {
    expect(conform(kleene(nilable(p.int)), [null])).to.eql([null]);
    expect(conform(kleene(maybe('i', p.int)), [])).to.eql([]);
  });

  it('multiple correct values', () => {
    expect(conform(kleene(p.int), [42, 21])).to.eql([42, 21]);
  });

  it('multiple incorrect values', () => {
    expect(conform(kleene(p.int), [42, 21, 'x'])).to.eql(invalid);
    const a = explainData(kleene(p.int), [42, 21, 'x'])
    expect(a[0].predicate).to.eql(p.int);
    expect(a[0].path).to.eql([2]);
    expect(a[0].via).to.eql([]);
    expect(a[0].value).to.eql('x');
  });

  it('single incorrect value', () => {
    expect(conform(kleene(p.int), ['x'])).to.eql(invalid);
    const a = explainData(kleene(p.int), ['x'])
    expect(a[0].predicate).to.eql(p.int);
    expect(a[0].path).to.eql([0]);
    expect(a[0].via).to.eql([]);
    expect(a[0].value).to.eql('x');
  });
});
