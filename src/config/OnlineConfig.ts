import BaseConfig from "./BaseConfig";
import { Client, ClientConfig } from "pg";
import ILogger from "../logger/ILogger";

class OnlineConfig {
  readonly #clientConfig: ClientConfig;
  #type: string;
  #logger: ILogger;
  #config?: BaseConfig;

  constructor(logger: ILogger, type: string, clientConfig: ClientConfig) {
    this.#type = type;
    this.#clientConfig = clientConfig;
    this.#logger = logger;
  }

  public async pull() {
    const client: Client = new Client(this.#clientConfig);
   await client.connect((err) => {
      if (err) {
        this.#logger.err("OnlineConfig.pull error: " + err.stack);
      } else {
        this.#logger.log("OnlineConfig.pull connected!");
      }
    });
   await client.query(
      `SELECT * FROM dev_account_dependencies WHERE type='${this.#type}';`,
      (err, res) => {
        if (err) {
          this.#logger.err("OnlineConfig.pull error: " + err.stack);
        } else {
          this.#logger.log("OnlineConfig.pull" + res);
        }
      }
    );
    client.end((err) => {
      if (err) this.#logger.err("OnlineConfig.pull error: " + err.stack);
    });
    // todo: continue
  }
}

export default OnlineConfig;
