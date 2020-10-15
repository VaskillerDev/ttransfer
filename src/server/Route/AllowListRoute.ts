// singleton
import ILogger from "ttransfer_util/dist/src/logger/ILogger";

class AllowListRoute {
  private static instance: AllowListRoute;
  private static set: Set<string>;
  private constructor() {}

  public static getInstance(): AllowListRoute {
    if (!this.instance) {
      this.instance = new AllowListRoute();
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

export default AllowListRoute;
