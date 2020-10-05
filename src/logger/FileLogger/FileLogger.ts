import fs, { mkdir } from "fs";
import ILogger from "../ILogger";

class FileLogger implements ILogger {
  readonly #pathToLogFile: String;
  readonly #tag: String;

  constructor(pathToLogFile?: String, tag?: String) {
    this.#pathToLogFile = pathToLogFile || "./out/log/logfile";
    const logFileExist = fs.existsSync("" + this.#pathToLogFile);
    if (!logFileExist) {
      //mkdir;
    }
    this.#tag = tag || "[FileLogger]";
  }

  log(msg: String): ILogger {
    let timeFormat: String = FileLogger.getTimeFormat();
    let outString: String = `|log> name: ${
      this.#tag
    }, time: ${timeFormat}, message: ${msg}`;
    this.writeMessage(outString);
    return this;
  }
  err(msg: String): ILogger {
    let timeFormat: String = FileLogger.getTimeFormat();
    let outString: String = `|err> name: ${
      this.#tag
    }, time: ${timeFormat}, message: ${msg}`;
    this.writeMessage(outString);
    return this;
  }
  warn(msg: String): ILogger {
    let timeFormat: String = FileLogger.getTimeFormat();
    let outString: String = `|warn> name: ${
      this.#tag
    }, time: ${timeFormat}, message: ${msg}`;
    this.writeMessage(outString);
    return this;
  }

  private static getTimeFormat(): String {
    return new Date().toLocaleTimeString();
  }

  private writeMessage(msg: String) {
    fs.appendFileSync("" + this.#pathToLogFile, "" + msg + "\n");
  }
}

export default FileLogger;
