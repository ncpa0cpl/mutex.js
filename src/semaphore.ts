import { OrderedMap } from "./ordered-map";

/**
 * An interface for a integer value. Exposes method for
 * incrementing and decrementing the integer, and listening for
 * the changes of it.
 */
export class Semaphore {
  private _counter = 0;
  private _signalListeners = new OrderedMap<
    symbol,
    () => void | Promise<void>
  >();

  private async sendSignal() {
    for (const value of this._signalListeners.values()) {
      await value();
    }
  }

  /**
   * Returns a number that is the count of all non-released
   * `acquires` on this semaphore.
   */
  value(): number {
    return this._counter;
  }

  /**
   * Increases the counter value that can be read via `.value()`
   * by one (1) and sends a signal informing of the state change
   * of this semaphore.
   */
  acquire(): void {
    this._counter++;
    this.sendSignal();
  }

  /**
   * Decreases the counter value that can be read via `.value()`
   * by one (1) and sends a signal informing of the state change
   * of this semaphore.
   */
  release(): void {
    this._counter--;
    this.sendSignal();
  }

  /**
   * Adds a callback that will be called whenever a signal is
   * emitted. Signal is emitted whenever the counter that can be
   * read via `.value()` changes.
   */
  onSignal(callback: () => void | Promise<void>): () => void {
    const id = Symbol();

    this._signalListeners.set(id, callback);

    return () => this._signalListeners.delete(id);
  }
}
