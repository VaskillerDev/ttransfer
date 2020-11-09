import ConsoleLogger from "ttransfer_util/dist/src/logger/ConsoleLogger/ConsoleLogger";
import ApplicationServer from "./server/ApplicationServer";
import OfflineConfig from "./config/OfflineConfig";
import SecurityRoute from "./server/Route/SecurityRoute";
import {
  Http2ServerConnection,
  Req,
  Res,
  SecurityPolicy,
} from "ttransfer_util";

type Protocol = "http" | "https";

const APP_NET_PROTOCOL: Protocol = "https";
const APP_ADDRESS: string = "localhost";
const APP_PORT: number = 9090;
const APP_CONFIG: OfflineConfig = OfflineConfig.getInstance();

const App = () => {
  const logger: ConsoleLogger = new ConsoleLogger();
  const server: ApplicationServer = new ApplicationServer(
    logger,
    APP_NET_PROTOCOL,
    APP_ADDRESS,
    APP_PORT,
    APP_CONFIG
  );

  const authRoute = new SecurityRoute("/f", "get");
  const authLambda = (
    req: Req,
    res: Res,
    policy: SecurityPolicy | undefined
  ): void => {};

  server.use(authRoute, authLambda);
};

export default App;
