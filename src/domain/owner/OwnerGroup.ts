class OwnerGroup {
  #id: String;
  #name: String;
  #holderId: String;
  #guestIds: String[];

  public constructor(
    id: String,
    name: String,
    holderId: String,
    guestIds?: String[]
  ) {
    this.#id = id;
    this.#name = name;
    this.#holderId = holderId;
    this.#guestIds = guestIds || [];
  }

  public getGuestIds(): String[] | undefined {
    return this.#guestIds;
  }
}
export default OwnerGroup;
