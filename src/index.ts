// main codepoint
import {ConsoleLogger, Http2ServerConnection, ILogger, Logger, Server} from "ttransfer_util";
import {IncomingMessage, ServerResponse} from "http";

type Protocol = "http" | "https";
type ImplServerConnection<T> = Http2ServerConnection<T> | Http2ServerConnection<T>;

(() => {
    const fileLogger: ILogger = new ConsoleLogger();
    const logger = new Logger(fileLogger);
    const protocol : Protocol = "http";
    const server = new Server(logger,protocol,"localhost",9090);
    server.on("/f",(req : IncomingMessage,res : ServerResponse)=>{
        logger.log("ip: " + req.connection.remoteAddress || "none");
        res.statusCode = 200;
        res.end();
    })


})();
