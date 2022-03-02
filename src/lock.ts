export class Lock {
  private readonly _awaiter: Promise<void>;

  /** Releases the Lock. */
  release = () => {};

  constructor() {
    this._awaiter = new Promise((resolve) => {
      this.release = resolve;
    });
  }

  /** Returns a promise that resolves when the Lock releases. */
  async wait() {
    return await this._awaiter;
  }
}
