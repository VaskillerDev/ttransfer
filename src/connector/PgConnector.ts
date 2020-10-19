import ILogger from "ttransfer_util/dist/src/logger/ILogger";
import { Client, ClientConfig } from "pg";
import { EventEmitter } from "events";

class ConnectionEmitter extends EventEmitter {}

type StateOfConnect = "none" | "connect" | "reject";
type OnConnectionType = (connect: boolean) => void;
type OnErrorType = (err: string) => void;

const ON_CONNECTION: string = "onConnection";
const ON_ERROR: string = "onError";

class PgConnector implements IConnector{
  logger?: ILogger;
  client?: Client;
  emitter?: ConnectionEmitter;
  static instance?: PgConnector;

  static user?: string = process.env.PG_USER;
  static pwd?: string = process.env.PG_PWD;
  static db?: string = process.env.PG_DB;
  static host?: string = process.env.PG_HOST;
  static port?: number = Number.parseInt(process.env.PG_PORT as string);

  private constructor() {}

  public static getInstance(): PgConnector {
    if (!PgConnector.instance) PgConnector.instance = new PgConnector();
    return PgConnector.instance;
  }

  checkSelfConfig(): void {
    if (!this.logger)
      throw new Error(
        "PgConnector.logger not found in checkSelfConfig() method"
      );
    if (!PgConnector.user) {
      this.logger.err("PgConnector.user not found");
    } else if (!PgConnector.pwd) {
      this.logger.err("PgConnector.pwd not found");
    } else if (!PgConnector.db) {
      this.logger.err("PgConnector.db not found");
    } else if (!PgConnector.host) {
      this.logger.err("PgConnector.host not found");
    } else if (!PgConnector.port) {
      this.logger.err("PgConnector.port not found");
    } else {
      this.logger.log("PgConnector ready for connection");
    }
  }

  public setLogger(logger: ILogger) {
    this.logger = logger;
  }

  public setupEmitter() {
    if (!this.emitter) {
      this.emitter = new ConnectionEmitter();
    }
    const onError: OnErrorType = (err) => {
      if (!this.logger)
        throw new Error(
          "PgConnector.logger not found in setupEmitter() method"
        );
      this.logger.err(err);
    };
    this.emitter.on(ON_ERROR, onError);
  }

  async connect(): Promise<void> {
    if (!this.logger)
      throw new Error("PgConnector.logger not found in connect() method");
    if (!this.client) {
      const clientConfig: ClientConfig = {
        user: PgConnector.user,
        password: PgConnector.pwd,
        database: PgConnector.db,
        host: PgConnector.host,
        port: PgConnector.port,
      };
      this.logger.log("PgConnector connect to " + clientConfig.database);
      this.client = new Client(clientConfig);
      await this.client.connect((err: Error) => {
        if (!this.emitter)
          throw new Error("PgConnector.emitter not found in connect() method");
        if (err) this.emitter.emit(ON_ERROR, `PgConnector event: ${err.stack}`);
      });
    }
  }

    async disconnect(): Promise<void> {
      if (this.client) await this.client.end();
      if (this.logger) this.logger.log("PgConnector disconnect");
    }

    query<T>(func:( pgClient : Client) => T): Promise<T>  {
        return new Promise(resolve => {
          if (!this.client) throw new Error("PgConnector.client not found in query() method");
          resolve(func(this.client));
        });
    }
}

export default PgConnector;
