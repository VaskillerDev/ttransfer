import OnlineConfig from "../src/config/OnlineConfig";
import ConsoleLogger from "../src/logger/ConsoleLogger/ConsoleLogger";

describe("OnlineConfig test flow", async () => {
  const logger: ConsoleLogger = new ConsoleLogger();
  it("Connect to database", (done) => {
    const config: OnlineConfig = new OnlineConfig(logger, "dev-local0", {
      /*user: "",
      password: "",
      database: "",
      host: "",
      port: ,*/
    });
    config.pull();
    done();
  });
});
