class Message {
  readonly #who: String;
  readonly #time: String;
  readonly #message: String;

  constructor(message: String, who: String, time: String) {
    this.#message = message;
    this.#who = who;
    this.#time = time;
  }

  public toString(): String {
    return `who: ${this.#who} time: ${this.#time} message: ${this.#message}`;
  }
}
