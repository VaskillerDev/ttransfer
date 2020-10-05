import ILogger from "../logger/ILogger";
import Route from "./Route";
import IServerCore from "../server/ServerCore/IServerCore";

class Listener {
  readonly #port: number;
  readonly #logger: ILogger;
  readonly #server: IServerCore;
  #routes: Map<String, Route>;

  constructor(logger: ILogger, server: IServerCore, port: number) {
    this.#logger = logger;
    this.#server = server;
    this.#port = port;
    this.#routes = new Map<String, Route>();
  }

  public add(key: String, route: Route): Listener {
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
