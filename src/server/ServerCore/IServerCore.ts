interface IServerCore {
  create(port: number, hostname: String): void;
  on(key: String, func: any): void;
  close(func?: (err: any) => void): void;
}

export default IServerCore;
