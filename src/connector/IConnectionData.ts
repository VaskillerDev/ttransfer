interface IConnectionData<T> {
  data: T;
  setData<T>(data: T): void;
  getData<T>(): T;
}
