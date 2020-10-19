import { SecurityPolicy } from "ttransfer_util";
import { IncomingHttpHeaders } from "http2";
// todo: maybe rm
class AuthPolicy extends SecurityPolicy {
  constructor(method: String, incomingHttpHeaders: IncomingHttpHeaders) {
    super(method, incomingHttpHeaders);
    for (let header in incomingHttpHeaders) {
      console.log("h: " + header);
    }
  }
}
