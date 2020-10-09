import OwnerGroup from "../owner/OwnerGroup";
import Owner from "../owner/Owner";
import { ILogger } from "ttransfer_util";

type ConnectStatus = "success" | "reject" | "waiting" | "none";

abstract class AbstractAccessor {
  readonly #accessorTag: String;
  readonly #logger: ILogger;
  #status: ConnectStatus = "none";

  //  policy of restriction
  #requirePayload: boolean = false;
  #isPayloadLoaded: boolean = false;
  #payload: unknown;

  protected constructor(logger: ILogger, tag: String) {
    this.#logger = logger;
    this.#accessorTag = tag;
  }

  connect(
    source: AbstractAccessor,
    cb: (ctx: AbstractAccessor) => ConnectStatus
  ): ConnectStatus {
    this.#logger.log(`connect ${this.getTag()} -> ${source.getTag()}`);
    if (this.#requirePayload) {
      if (this.#isPayloadLoaded) {
        this.#status = cb(this);
      } else {
        this.#logger.err(
          `AbstractAccessor (${this.getTag()}): payload is not loaded`
        );
      }
    }
    this.#status = cb(this);
    return this.#status;
  }

  setPayload<T>(payload: T): AbstractAccessor {
    if (!this.#isPayloadLoaded) {
      this.#payload = payload;
      this.#isPayloadLoaded = true;
    } else {
      this.#logger.log(
        `AbstractAccessor (${this.getTag()}): payload is already loaded`
      );
    }
    return this;
  }

  public getTag(): String {
    return this.#accessorTag;
  }

  public getStatus() {
    return this.#status;
  }

  abstract getOwnerByID(id: String): Owner;
  abstract getOwnerGroupById(id: String): OwnerGroup;
  abstract getOwnerByKeyValue(key: String, value: String): Owner[];
  abstract getOwnerGroupByKeyValue(key: String, value: String): OwnerGroup[];
}

export default AbstractAccessor;
