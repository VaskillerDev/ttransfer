interface IServerCore {
  create(port: number, hostname: String): void;
  on(key: string, func: any): void;
  close(func?: (err: any) => void): void;
  rm(key: string, func?: (...args: any[]) => void): void;
  getKeys(): Array<string | symbol>;
}

export default IServerCore;
