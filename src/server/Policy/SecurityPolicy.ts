import { IncomingHttpHeaders } from "http";

class SecurityPolicy {
  readonly #method: String;
  readonly #incomingHttpHeaders?: IncomingHttpHeaders;
  constructor(method: String, incomingHttpHeaders: IncomingHttpHeaders) {
    this.#method = method;
    this.#incomingHttpHeaders = incomingHttpHeaders;
  }

  public compare(method: String): boolean {
    let result = true;
    result = result && this.#method === method;

    return result;
  }
}

export default SecurityPolicy;
