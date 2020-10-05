import { Console } from "console";
import ILogger from "../ILogger";

class ConsoleLogger implements ILogger {
  #console: Console;
  readonly #tag: String;

  constructor(tag?: String) {
    this.#console = new Console(process.stdout, process.stderr);
    this.#console.log("Init ConsoleLogger.");
    this.#tag = tag || "[ConsoleLogger]";
  }

  public log(msg: String): ILogger {
    let timeFormat: String = this.getTimeFormat();
    let outString: String = `|log> name: ${
      this.#tag
    }, time: ${timeFormat}, message: ${msg}`;
    this.#console.log(outString);
    return this;
  }
  public err(msg: String): ILogger {
    let timeFormat: String = this.getTimeFormat();
    let outString: String = `|err> name: ${
      this.#tag
    }, time: ${timeFormat}, message: ${msg}`;
    this.#console.error(outString);
    return this;
  }
  public warn(msg: String): ILogger {
    let timeFormat: String = this.getTimeFormat();
    let outString: String = `|warn> name: ${
      this.#tag
    }, time: ${timeFormat}, message: ${msg}`;
    this.#console.warn(outString);
    return this;
  }

  private getTimeFormat(): String {
    return new Date().toLocaleTimeString();
  }
}

export default ConsoleLogger;
