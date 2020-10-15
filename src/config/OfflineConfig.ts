import { BaseConfig } from "ttransfer_util";

class OfflineConfig extends BaseConfig {
  public static getInstance(): BaseConfig {
    return {
      protocol: "https",
      hostname: "localhost",
      port: 9090,
      keyPath: process.env.KEY || "undefined",
      certPath: process.env.CERT || "undefined",
    };
  }
}
export default OfflineConfig;
