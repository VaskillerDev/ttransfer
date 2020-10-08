import IServerCore from "./IServerCore";
import { HttpServerCore } from "./HttpServerCore/HttpServerCore";
import Http2ServerCore from "./Http2ServerCore/Http2ServerCore";
import ILogger from "../../logger/ILogger";
import { SecureServerOptions } from "http2";
import { readFileSync } from "fs";
import Http2ServerConnection from "./Http2ServerCore/Http2ServerConnection";
import HttpServerConnection from "./HttpServerCore/HttpServerConnection";
import OfflineConfig from "../../config/OfflineConfig";

type ImplServerCore = HttpServerCore | Http2ServerCore;
type ImplServerConnection<T> =
  | HttpServerConnection<T>
  | Http2ServerConnection<T>;

class ServerCore implements IServerCore {
  readonly #logger: ILogger;
  readonly #protocol: String;
  #server?: ImplServerCore;

  //public:
  constructor(logger: ILogger, protocol: String) {
    this.#logger = logger;
    this.#protocol = protocol;
  }

  create(port: number, hostname: String): void {
    this.#logger.log("ServerCore.create()...");
    switch (this.#protocol) {
      case "http":
        this.createHttpServerCore();
        break;
      case "https":
        this.createHttp2ServerCore();
        break;
    }
    if (this.#server === undefined) {
      this.#logger.err("ServerCore.server not found");
      throw new Error(
        "ServerCore.server not found in ServerCore.create() method"
      );
    }
    this.#server.create(port, hostname);
  }

  on<T>(url: String, func: ImplServerConnection<T>): ServerCore {
    if (this.#server === undefined) {
      this.#logger.err("ServerCore.server not found");
      throw new Error("ServerCore.server not found in ServerCore.on() method");
    }
    if (this.#server instanceof HttpServerCore) {
      (this.#server as HttpServerCore).on(url, func as HttpServerConnection<T>);
      return this;
    } else if (this.#server instanceof Http2ServerCore) {
      (this.#server as Http2ServerCore).on(
        url,
        func as Http2ServerConnection<T>
      );
      return this;
    }
    return this;
  }

  close(func?: (err: any) => void): ServerCore {
    this.#logger.log("ServerCore.close()...");
    if (this.#server === undefined) {
      this.#logger.err("ServerCore.server not found");
      throw new Error(
        "ServerCore.server not found in ServerCore.close() method"
      );
    }
    this.#server.close(func);
    return this;
  }
  // private:
  private createHttpServerCore() {
    this.#server = new HttpServerCore(this.#logger);
  }

  private createHttp2ServerCore() {
    const secureServerOptions: SecureServerOptions = {
      key: readFileSync(OfflineConfig.getInstance().keyPath),
      cert: readFileSync(OfflineConfig.getInstance().certPath),
      allowHTTP1: true,
    };
    this.#server = new Http2ServerCore(this.#logger, secureServerOptions);
  }

  rm(key: String, func?: (...args: any[]) => void): void {
    if (!this.#server) {
      this.#logger.err("ServerCore.server not found in ServerCore.rm() method");
      return;
    }
    this.#server.rm(key,func);
  }
}

export default ServerCore;
