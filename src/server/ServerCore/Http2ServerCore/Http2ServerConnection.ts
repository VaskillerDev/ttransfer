import { Http2ServerRequest, Http2ServerResponse } from "http2";
import SecurityPolicy from "../../Policy/SecurityPolicy";

type Http2ServerConnection<T> = (
  req: Http2ServerRequest,
  res: Http2ServerResponse,
  securityPolicy?: SecurityPolicy
) => T;

export default Http2ServerConnection;
