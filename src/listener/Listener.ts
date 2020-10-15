/*
import { ILogger, IServerCore } from "ttransfer_util";

class Listener {
  readonly #port: number;
  readonly #logger: ILogger;
  readonly #server: IServerCore;
  #routes: Map<String, BasicRoute>;

  constructor(logger: ILogger, server: IServerCore, port: number) {
    this.#logger = logger;
    this.#server = server;
    this.#port = port;
    this.#routes = new Map<String, BasicRoute>();
  }

  public add(key: String, route: BasicRoute): Listener {
    this.#routes.set(key, route);
    return this;
  }

  public listen(func: Function) {
    func(this.#server);
  }

  public getPort(): number {
    return this.#port;
  }
}

export default Listener;
*/
