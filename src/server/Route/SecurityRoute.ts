import { BasicRoute } from "ttransfer_util";
import AllowListRoute from "./AllowListRoute";

type Method = "post" | "get" | "put" | "delete";

class SecurityRoute extends BasicRoute {
  constructor(url: string | symbol, method: Method) {
    super(url, method);
    AllowListRoute.add(url as string); // todo: rewrite later - singleton in object
  }
}

export default SecurityRoute;
