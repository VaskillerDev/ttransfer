import PgConnector from "../src/connector/PgConnector";
import { ConsoleLogger } from "ttransfer_util";

const wait = async (ms: number) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};
(async () => {
  const logger: ConsoleLogger = new ConsoleLogger();
  const pgConnector = PgConnector.getInstance();
  pgConnector.setLogger(logger);
  pgConnector.setupEmitter();
  await pgConnector.connect();

  await pgConnector.query<void>((pgClient) => {
    pgClient
      .query(`SELECT * FROM dev_account_dependencies`)
      .then((res) => console.log(res.rows[0]))
      .catch((err) => console.log(err));
  });

  await wait(25000);
  await pgConnector.disconnect();
})();
