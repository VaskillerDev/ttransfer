import IServerCore from "../IServerCore";
import ILogger from "../../../logger/ILogger";
import SecurityPolicy from "../../Policy/SecurityPolicy";
import {
  createSecureServer,
  Http2SecureServer,
  SecureServerOptions,
} from "http2";
import Http2ServerConnection from "./Http2ServerConnection";

class Http2ServerCore implements IServerCore {
  readonly #server: Http2SecureServer;
  #logger: ILogger;
  #urls: Map<string, Http2ServerConnection<any>>;

  constructor(logger: ILogger, secureServerOptions: SecureServerOptions) {
    this.#server = createSecureServer(secureServerOptions);
    this.#logger = logger;
    this.#urls = new Map<string, Http2ServerConnection<any>>();
  }

  create(port: number, hostname: String): void {
    this.#server.on("request", (req, res) => {
      if (this.#urls.size === 0) {
        return res.end(() => {
          this.#logger.warn("Http2ServerCore urls map is empty");
        });
      }
      const url = new URL("" + req.url, `https://${req.headers.host}`);
      const { pathname } = url;
      const func = this.#urls.get(pathname);
      if (func === undefined) {
        return res.end(() => {
          this.#logger.log(
            `Http2ServerCore func for ${pathname} request not found`
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
        `Http2ServerCore HTTPS server has been created. On ${hostname}:${port}.`
      );
    });
  }

  on<T>(url: string, func: Http2ServerConnection<T>): Http2ServerCore {
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

export default Http2ServerCore;
