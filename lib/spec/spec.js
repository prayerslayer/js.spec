export default class Spec {
  constructor(options) {
    this.options = options
  }

  conform(value) {
    throw new Error("Implement in subclass")
  }

  unform(conformed) {
    throw new Error("Implement in subclass")
  }

  explain(value) {
    throw new Error("Implement in subclass")
  }
}
