import PgConnector from "../src/connector/PgConnector";
import { ConsoleLogger } from "ttransfer_util";

const wait = async (ms: number) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};

describe("PgConnector flow", () => {
  const logger: ConsoleLogger = new ConsoleLogger();
  it("Connect to database", () => {
    const pgConnector = PgConnector.getInstance();
    pgConnector.setLogger(logger);
    pgConnector.setupEmitter();
    pgConnector.connect();

    pgConnector.query<void>((pgClient => {
      pgClient
          .query(`SELECT * FROM dev_account_dependencies`)
          .then(res=>console.log(res.rows[0].message));
    }))

    wait(5000);
    pgConnector.disconnect();
  });
});
