import { IncomingMessage, ServerResponse } from "http";
import SecurityPolicy from "../../Policy/SecurityPolicy";

type HttpServerConnection<T> = (
  req: IncomingMessage,
  res: ServerResponse,
  securityPolicy?: SecurityPolicy
) => T;

export default HttpServerConnection;
