class Config {
  public static getInstance() {
    return {
      protocol: "https",
      hostname: "localhost",
      port: 9090,
      keyPath: "../../../../../../../etc/ssl/mediator-selfsigned.key",
      certPath: "../../../../../../../etc/ssl/certs/mediator-selfsigned.crt",
    };
  }
}
export default Config;
