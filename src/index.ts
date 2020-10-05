import FileLogger from "./logger/FileLogger/FileLogger";
import ILogger from "./logger/ILogger";
import Logger from "./logger/Logger";
import { HttpServerCore } from "./server/ServerCore/HttpServerCore/HttpServerCore";
import ConsoleLogger from "./logger/ConsoleLogger/ConsoleLogger";

// main codepoint
(() => {
  /*  const fileLogger: ILogger = new ConsoleLogger();
  const logger = new Logger(fileLogger);
  const serverCore = new HttpServerCore(logger);
  serverCore.create(9090);*/
})();
