// interface for Logger system
interface ILogger {
  log(msg: String): ILogger;
  err(msg: String): ILogger;
  warn(msg: String): ILogger;
}

export default ILogger;
