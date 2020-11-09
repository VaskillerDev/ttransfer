import ConsoleLogger from "ttransfer_util/dist/src/logger/ConsoleLogger/ConsoleLogger";
import tg from "../src/telegramBot/Bot";
import Bot = tg.Bot;
import PgConnector from "../src/connector/PgConnector";

(async () => {
  const logger: ConsoleLogger = new ConsoleLogger();
  const pgConnector = PgConnector.getInstance();
  pgConnector.setLogger(logger);
  pgConnector.setupEmitter();
  await pgConnector.connect();
  const bot: Bot = new Bot(logger, pgConnector);
})();
