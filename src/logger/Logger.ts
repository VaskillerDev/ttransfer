import ILogger from "./ILogger";

class Logger implements ILogger {
  readonly #encapsulatedLogger: ILogger;

  constructor(logger: ILogger) {
    this.#encapsulatedLogger = logger;
  }

  log(msg: String): ILogger {
    this.#encapsulatedLogger.log(msg);
    return this.#encapsulatedLogger;
  }
  err(msg: String): ILogger {
    this.#encapsulatedLogger.err(msg);
    return this.#encapsulatedLogger;
  }
  warn(msg: String): ILogger {
    this.#encapsulatedLogger.warn(msg);
    return this.#encapsulatedLogger;
  }
}

export default Logger;
