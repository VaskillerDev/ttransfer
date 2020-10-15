import {
  ILogger,
  IRoute,
  IServerConnection,
  Server,
  ServerConnectionDTO,
} from "ttransfer_util";
import AllowListRoute from "./Route/AllowListRoute";
import BaseConfig from "ttransfer_util/dist/src/config/BaseConfig";

type Protocol = "http" | "https";
type Method = "post" | "get" | "put" | "delete";

class ApplicationServer extends Server {
  readonly #_port: number;
  readonly #_protocol: Protocol;

  constructor(
    logger: ILogger,
    protocol: Protocol,
    hostname: string,
    port: number,
    config?: BaseConfig
  ) {
    super(logger, protocol, hostname, port, config);
    this.#_port = port;
    this.#_protocol = protocol;
    this.logger = logger;
  }

  get getPort(): number {
    return this.#_port;
  }

  get getProtocol(): Protocol {
    return this.#_protocol;
  }

  use<T>(
    route: IRoute,
    connection: IServerConnection<T> | ServerConnectionDTO
  ): this {
    const method = route.method as Method;
    const url = route.url;
    if (!AllowListRoute.check(url as string)) {
      this.logger.log("throw " + (url as string));
      return this; // end
    }
    if (
      !(
        method === "post" ||
        method === "get" ||
        method === "put" ||
        method === "delete"
      )
    ) {
      this.logger.err(
        `ApplicationServer method ${method} not found for use() method`
      );
      return this; // end
    }

    if (connection instanceof ServerConnectionDTO) {
      this.onForDTO(url, connection);
      return this; // end
    }

    this.on<T>(url, connection as IServerConnection<T>);
    return this; //end
  }
}

export default ApplicationServer;
