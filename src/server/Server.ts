import ServerCore from "./ServerCore/ServerCore";
import ILogger from "../logger/ILogger";
import { EventEmitter } from "events";
import HttpServerConnection from "./ServerCore/HttpServerCore/HttpServerConnection";
import Http2ServerConnection from "./ServerCore/Http2ServerCore/Http2ServerConnection";

type Protocol = "http" | "https";
type Method = "post" | "get" | "put" | "delete";

type ImplServerConnection<T> =
  | HttpServerConnection<T>
  | Http2ServerConnection<T>;

class Server implements NodeJS.EventEmitter {
  #eventEmitter: EventEmitter;

  protected serverCore?: ServerCore;
  protected logger: ILogger;
  protected protocol?: Protocol;

  protected static NETWORK_REQUEST_TRACING: boolean = false;
  protected static NOT_IMPLEMENT_FUTURE_TRACING: boolean = false;
  protected static MAX_LISTENED_URLS: number = 64;

  constructor(
    logger: ILogger,
    protocol: Protocol,
    hostname?: string,
    port?: number
  ) {
    this.logger = logger;
    this.protocol = protocol;
    this.serverCore = new ServerCore(logger, protocol);
    this.serverCore.create(port || 9090, hostname || "localhost");

    this.#eventEmitter = new EventEmitter();
  }

  addListener<T>(
    url: string | symbol,
    connection: ImplServerConnection<T>
  ): this {
    return this.on(url, connection);
  }

  emit(event: string | symbol, ...args: any[]): boolean {
    return false;
  }

  eventNames(): Array<string | symbol> {
    if (!this.serverCore) {
      this.logger.err(
        "Server.serverCore not found in Server.eventNames() method."
      );
      return [];
    }
    return this.serverCore.getKeys();
  }

  getMaxListeners(): number {
    return Server.MAX_LISTENED_URLS;
  }

  listenerCount(url: string | symbol): number {
    if (!(this.serverCore && url)) {
      this.logger.err(
        "Server.serverCore not found in Server.listenerCount() method."
      );
      return 0;
    }
    return this.serverCore.getKeys().find((listenedUrl) => listenedUrl === url)
      ? 1
      : 0;
  }

  listeners(event: string | symbol): Function[] {
    return [];
  }

  off(url: string | symbol, listener: (...args: any[]) => void): this {
    if (!(this.serverCore && url)) {
      this.logger.err("Server.serverCore not found in Server.off() method.");
      return this;
    }
    url = url.toString();
    this.serverCore.rm(url, listener);
    return this;
  }

  on<T>(url: string | symbol, connection: ImplServerConnection<T>): this {
    if (!(this.serverCore && url)) {
      this.logger.err("Server.serverCore not found in Server.on() method.");
      return this;
    }
    url = url.toString();
    this.serverCore.on<T>(url, connection);
    return this;
  }

  // not impl
  once<T>(url: string | symbol, connection: ImplServerConnection<T>): this {
    if (!(this.serverCore && url)) {
      this.logger.err("Server.serverCore not found in Server.once() method.");
      return this;
    }
    this.logger.warn("Server.once() method not yet implement");
    return this;
  }

  prependListener<T>(
    url: string | symbol,
    connection: ImplServerConnection<T>
  ): this {
    if (!(this.serverCore && url)) {
      this.logger.err(
        "Server.serverCore not found in Server.prependListener() method."
      );
      return this;
    }
    url = url.toString();
    if (Server.NETWORK_REQUEST_TRACING)
      this.logger.log(
        `Server.serverCore: \n| url: ${url} \n| connection: ${connection}`
      );
    return this;
  }

  // not impl
  prependOnceListener<T>(
    url: string | symbol,
    connection: ImplServerConnection<T>
  ): this {
    if (!(this.serverCore && url)) {
      this.logger.err(
        "Server.serverCore not found in Server.prependOnceListener() method."
      );
      return this;
    }
    if (Server.NOT_IMPLEMENT_FUTURE_TRACING)
      this.logger.warn("Server.prependOnceListener() method not yet implement");
    return this;
  }

  rawListeners(event: string | symbol): Function[] {
    return [];
  }

  // not impl
  removeAllListeners(event?: string | symbol): this {
    if (Server.NOT_IMPLEMENT_FUTURE_TRACING)
      this.logger.warn("Server.removeAllListeners() method not implement");
    return this;
  }

  removeListener(
    url: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return this.off(url, listener);
  }

  // not impl
  setMaxListeners(n: number): this {
    if (Server.NOT_IMPLEMENT_FUTURE_TRACING)
      this.logger.warn("Server.setMaxListeners() method not yet implement");
    return this;
  }
}
