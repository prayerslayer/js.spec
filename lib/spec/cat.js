import Spec from './spec'
import { getName } from '../util'
import * as p from '../predicates'
import chunk from 'lodash.chunk'
import { invalid } from '../symbols'
import { catImpl, conform as reConform } from '../regex'

export class Cat extends Spec {
  conform(value) {
    return reConform(this.options.op, value)
  }

  toString() {
    return this.name || `Cat(${this.options.specs.map(({name}) => name).join(", ")})`
  }

  explain(path, via, value) {}
}

export default function cat(...args) {
  if (args.length === 0) {
    throw new Error(`Cannot use Cat spec without predicates.`)
  }
  if (p.odd(args.length)) {
    throw new Error(`Need to supply Cat with even amount of arguments.`)
  }
  return new Cat({
    op: catImpl(chunk(args))
  })
}
