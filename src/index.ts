// main codepoint
import {
  ConsoleLogger,
  Http2ServerConnection,
  Logger,
  Server,
  ServerConnectionDTO,
  IServerConnection,
  BasicRoute,
  SecurityPolicy,
  ILogger,
  Req,
  Res,
} from "ttransfer_util";
import ApplicationServer from "./server/ApplicationServer";
import { IncomingMessage } from "http";
import { Socket } from "net";
import SecurityRoute from "./server/Route/SecurityRoute";
import AllowListRoute from "./server/Route/AllowListRoute";
import OfflineConfig from "./config/OfflineConfig";
import PgConnector from "./connector/PgConnector";

type Protocol = "http" | "https";

(() => {
  /* const fileLogger: ILogger = new ConsoleLogger();
  const logger = new Logger(fileLogger);
  const protocol: Protocol = "https";
  const server = new ApplicationServer(
    logger,
    protocol,
    "localhost",
    9090,
    OfflineConfig.getInstance()
  );

  AllowListRoute.getInstance();
  const secRoute = new SecurityRoute("/f", "post");

  //todo: to fix the convergence types
  const connection = (
    req: Req,
    res: Res,
    policy: SecurityPolicy | undefined
  ): void => {
    const gg = new ServerConnectionDTO(req, res, undefined);
    // @ts-ignore
    console.log("hostIp: " + gg.hostIp); //todo: rewrite

    //logger.log(req.connection.localAddress);
    res.statusCode = 200;
    res.end();
  };

  /!*  const c = new ServerConnectionDTO();
  c.extract(connection);
  // @ts-ignore
  logger.log(c.toObject().protocol);*!/

  AllowListRoute.print(logger);

  server.use<number>(secRoute, connection as IServerConnection<number>);*/
  const wait = async (ms: number) => {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  };

  const logger: ConsoleLogger = new ConsoleLogger();

  const pgConnector = PgConnector.getInstance();
  pgConnector.setLogger(logger);
  pgConnector.setupEmitter();
  pgConnector.connect();

  pgConnector.query<void>((pgClient => {
    pgClient
        .query(`SELECT * FROM dev_account_dependencies`)
        .then(res=>console.log(res.rows[0]))
        .catch(err=>console.log(err));
  }))

  //wait(8000);
  //pgConnector.disconnect();
})();
