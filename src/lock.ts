export class Lock {
  private readonly _awaiter: Promise<void>;

  /** Opens/releases the Lock. */
  open = () => {};

  constructor() {
    this._awaiter = new Promise((resolve) => {
      this.open = resolve;
    });
  }

  /** Returns a promise that resolves when the Lock opens. */
  async wait() {
    return await this._awaiter;
  }
}
