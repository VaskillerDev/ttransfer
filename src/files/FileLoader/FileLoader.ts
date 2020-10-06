import ILogger from "../../logger/ILogger";

class FileLoader {
  //#ownerID: String;
  #logger: ILogger;
  constructor(logger: ILogger) {
    this.#logger = logger;
  }
}

export default FileLoader;
