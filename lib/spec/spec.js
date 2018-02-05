export default class Spec {
  constructor(name = "", options) {
    // options is data necessary to check values for conformity
    this.options = options;
    // name is for better display when printing explain() result
    this.name = name;
  }

  conform(value) {
    throw new Error(`Implement in subclass: conform(${value})`);
  }

  explain(path, via, value) {
    throw new Error(
      `Implement in subclass: explain(${path}, ${via}, ${value})`
    );
  }
}
