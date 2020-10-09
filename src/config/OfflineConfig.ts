import { BaseConfig } from "ttransfer_util";

class OfflineConfig extends BaseConfig {
  public static getInstance(): BaseConfig {
    return {
      protocol: "https",
      hostname: "localhost",
      port: 9090,
      keyPath: "../../../../../../../etc/ssl/mediator-selfsigned.key",
      certPath: "../../../../../../../etc/ssl/certs/mediator-selfsigned.crt",
    };
  }
}
export default OfflineConfig;
