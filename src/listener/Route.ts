class Route {
  #path: String;
  #func: Function;

  constructor(key: String, func: Function) {
    this.#path = key;
    this.#func = func;
  }
}

export default Route;
