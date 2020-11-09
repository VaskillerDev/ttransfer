// singleton
import ILogger from "ttransfer_util/dist/src/logger/ILogger";

class AllowListForRoutes {
  private static instance: AllowListForRoutes;
  private static set: Set<string>;
  private constructor() {}

  public static getInstance(): AllowListForRoutes {
    if (!this.instance) {
      this.instance = new AllowListForRoutes();
      this.set = new Set<string>();
    }
    return this.instance;
  }

  public static add(url: string) {
    this.set.add(url);
  }

  /*public static get() : Set<string> {
        return this.set;
    }*/

  public static check(url: string): boolean {
    return this.set.has(url);
  }

  public static print(logger: ILogger): void {
    for (let url of this.set) logger.log(`AllowListRoute.set -> url: ${url}`);
  }
}

export default AllowListForRoutes;
