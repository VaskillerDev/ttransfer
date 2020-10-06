// Class for transfer-like object;
class BaseConfig {
  public readonly protocol: string;
  public readonly hostname: string;
  public readonly port: number;
  public readonly keyPath: string;
  public readonly certPath: string;

  constructor(
    protocol: string,
    hostname: string,
    port: number,
    keyPath: string,
    certPath: string
  ) {
    this.protocol = protocol;
    this.hostname = hostname;
    this.port = port;
    this.keyPath = keyPath;
    this.certPath = certPath;
  }

  public toString(): String {
    return `BaseConfig {\n 
        protocol: ${this.protocol},\n
        hostname: ${this.hostname},\n
        port: ${this.port},\n
        keyPath: ${this.keyPath},\n
        certPath: ${this.certPath},\n
        }`;
  }
}

export default BaseConfig;
