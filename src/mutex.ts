import { Lock } from "./lock";

/**
 * Mutex class instances provides an API for creating
 * asynchronous mutual exclusion Locks.
 *
 * Locks are a mechanism for synchronizing otherwise asynchronous actions.
 *
 * Locks have three states:
 *
 * - Acquired - Lock has been created and is awaiting for it to be opened.
 * - Opened - Lock has been opened and as long as it remains that
 *   way no other Lock from the same Mutex can change it's state
 * - Released - Lock is no longer blocking other Lock's from being Opened
 *
 * @example
 *   class DBConnection {
 *     private mutex = new Mutex();
 *
 *     async insert() {
 *       const lock = this.mutex.acquire(); // Lock has been acquired
 *       await lock; // Waiting for the lock to open
 *       // We recommend to use a simpler syntax:
 *       // await this.mutex.acquire();
 *
 *       // <put your async code here>
 *
 *       this.mutex.release(); // Lock is released, other lock can be opened now
 *     }
 *   }
 */
export class Mutex {
  private readonly _requests: Lock[] = [];

  private async _nextRequest() {
    this._requests[0]?.open();
  }

  /**
   * Acquire a new lock for this mutex, this lock will not open
   * until every lock acquired prior to this one is released.
   */
  async acquire() {
    const lock = new Lock();
    this._requests.push(lock);

    if (this._requests.length === 1) this._nextRequest();

    await lock.wait();
  }

  /** Release the currently opened/acquired lock. */
  release() {
    this._requests.shift();

    this._nextRequest();
  }
}
