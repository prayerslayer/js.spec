export default class Spec {
  constructor(options, name = '') {
    // options is data necessary to check values for conformity
    this.options = options
    // name is for better display when printing explain() result
    this.name = name
  }

  conform(value) {
    throw new Error(`Implement in subclass: conform(${value})`)
  }

  unform(conformed) {
    throw new Error(`Implement in subclass: unform(${conformed})`)
  }

  explain(value) {
    throw new Error(`Implement in subclass: explain(${value})`)
  }
}
