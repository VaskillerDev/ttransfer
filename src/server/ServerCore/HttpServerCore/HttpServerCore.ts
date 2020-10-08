import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import IServerCore from "../IServerCore";
import ILogger from "../../../logger/ILogger";
import SecurityPolicy from "../../Policy/SecurityPolicy";
import HttpServerConnection from "./HttpServerConnection";

class HttpServerCore implements IServerCore {
  readonly #server: Server;
  #logger: ILogger;
  #urls: Map<string, HttpServerConnection<any>>;

  constructor(logger: ILogger) {
    this.#server = createServer();
    this.#logger = logger;
    this.#urls = new Map<string, HttpServerConnection<any>>();
  }

  create(port?: number, hostname?: String): void {
    this.#server.on("request", (req: IncomingMessage, res: ServerResponse) => {
      if (this.#urls.size === 0) {
        return res.end(() => {
          this.#logger.warn("HttpServerCore urls map is empty");
        });
      }
      const url = new URL("" + req.url, `http://${req.headers.host}`);
      const { pathname } = url;
      const func = this.#urls.get(pathname);
      if (func === undefined) {
        return res.end(() => {
          this.#logger.log(
            `HttpServerCore func for ${pathname} request not found`
          );
        });
      }
      const { method } = req;
      if (method === undefined) {
        res.end();
      }
      const securityPolicy: SecurityPolicy = new SecurityPolicy(
        "" + method,
        req.headers
      );
      // default headers for response:
      res.setHeader("Content-Encoding", "gzip;");
      res.setHeader("Content-Security-Policy", "base-uri 'self';");
      res.setHeader("Content-Type", "text/plain; charset=UTF-8;");
      res.setHeader("Accept-Language", "en-US,en;q=0.5;");
      res.setHeader("X-Content-Type-Options", "nosniff;");
      res.setHeader("X-Frame-Options", "deny;");
      res.setHeader("X-Permitted-Cross-Domain-Policies", "none;");
      res.setHeader("Referrer-Policy", "strict-origin;");
      res.setHeader("X-XSS-Protection", "1; mode=block;");

      func(req, res, securityPolicy);
    });

    this.#server.listen(port, "" + hostname, () => {
      this.#logger.log(
        `HttpServerCore HTTP/1.1 server has been created. On ${hostname}:${port}.`
      );
    });
  }

  on<T>(url: string, func: HttpServerConnection<T>): HttpServerCore {
    this.#urls.set(url, func);
    return this;
  }

  close(func?: (err: any) => void): void {
    if (this.#server == null) {
      return;
    }
    this.#server.close(func);
  }

  rm(key: string, func?: (...args: any[]) => void): void {
    this.#urls.delete(key);
    if (func) func();
  }

  getKeys(): Array<string | symbol> {
    return Array.from(this.#urls.keys());
  }
}

export { HttpServerCore, HttpServerConnection };
