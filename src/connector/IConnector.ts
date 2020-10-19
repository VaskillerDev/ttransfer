//type IConnectorResult<T> = Promise<T> | Promise<void> | void;

interface IConnector {
  connect(): Promise<void>;
  query<T>(func: (...args: any[]) => T,...args: any[]): Promise<T> | void;
  disconnect(): Promise<void>;
}
