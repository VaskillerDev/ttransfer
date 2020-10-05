import ConsoleLogger from "../src/logger/ConsoleLogger/ConsoleLogger";
import Config from "../src/config/Config";
import ServerCore from "../src/server/ServerCore/ServerCore";
import { ClientRequest, IncomingMessage, ServerResponse } from "http";
import SecurityPolicy from "../src/server/Policy/SecurityPolicy";
import HttpServerConnection from "../src/server/ServerCore/HttpServerCore/HttpServerConnection";
import {
  ClientHttp2Session,
  ClientHttp2Stream,
  connect,
  SecureClientSessionOptions,
} from "http2";

//const PROTOCOL = Config.getInstance().protocol || "https";
const HOSTNAME = Config.getInstance().hostname || "localhost";
const PORT = Config.getInstance().port || 9090;
const logger: ConsoleLogger = new ConsoleLogger();

const wait = async (ms: number) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};

const testServerCoreFlow = (protocol: String) => {
  describe(`ServerCore flow for protocol:${protocol}`, () => {
    const serverCore: ServerCore = new ServerCore(logger, protocol);
    it("Init ServerCore", () => {
      serverCore.create(PORT, HOSTNAME);
      const connection = (
        req: IncomingMessage,
        res: ServerResponse,
        sp: SecurityPolicy
      ) => {
        if (sp !== undefined) {
          logger.log("securityPolicy: " + sp.compare("GET"));
        }
        res.setHeader("Content-Type", "text/html");
        res.write(`
        <html lang="ru">
        <body>
       <h1>WWW</h1>
        </body>
        </html>`);
        res.statusCode = 200;
        res.end();
      };
      serverCore.on<void>("/f", connection as HttpServerConnection<void>);
    });

    // Request agent request
    it("Request from agent", async () => {
      const urlRequest = `${protocol}://${HOSTNAME}:${PORT}`;
      if (protocol === "http") {
        const client: ClientRequest = new ClientRequest(
          `${urlRequest}/f`,
          (res) => {
            if (res.statusCode != 200) {
              return new Error(`ClientRequest error: ${res.statusCode}`);
            }
            for (const header in res.headers) {
              logger.log(
                `ClientRequest.header=${header || "NOT_FOUND_HEADER_KEY"} : ${
                  res.headers[header || "NOT_FOUND_HEADER_VALUE"]
                }`
              );
            }
          }
        );
        client.end();
      } else if (protocol === "https") {
        const secureClientOptions: SecureClientSessionOptions = {
          rejectUnauthorized: false,
        };
        const clientSession: ClientHttp2Session = connect(
          `${urlRequest}/f`,
          secureClientOptions
        );
        const stream: ClientHttp2Stream = clientSession.request();
        stream.on("push", (headers) => {
          for (const header in headers) {
            logger.log(
              `ClientHttp2Stream.response.header=${
                header || "NOT_FOUND_HEADER_KEY"
              }:${headers[header || "NOT_FOUND_HEADER_VALUE"]}`
            );
          }
        });
        stream.on("response", (headers) => {
          for (const header in headers) {
            logger.log(
              `ClientHttp2Stream.response.header=${
                header || "NOT_FOUND_HEADER_KEY"
              }:${headers[header || "NOT_FOUND_HEADER_VALUE"]}`
            );
          }
        });
        stream.on("error", (err: Error) => {
          throw new Error("ClientHttp2Stream error: " + err);
        });
        stream.on("timeout", (err: Error) => {
          throw new Error("ClientHttp2Stream error: " + err);
        });
        await wait(500);
        await clientSession.close();
      } else {
        throw new Error("Unknown protocol: " + protocol);
      }
    });

    it("Close ServerCore", async () => {
      await wait(2000);
      serverCore.close();
    });
  });
};

testServerCoreFlow("http");
testServerCoreFlow("https");
testServerCoreFlow("hdd");
