import { Lock } from "./lock";

/**
 * Mutex class instances provide an API for creating asynchronous
 * mutual exclusion Locks.
 *
 * Locks are a mechanism for synchronizing otherwise asynchronous actions.
 *
 * Locks have three states:
 *
 * - Waiting - other Locks are currently acquired, waiting for
 *   other locks to release
 * - Acquired - Lock has been acquired and as long as it remains
 *   that way any other attempts to acquire a lock will be
 *   suspended until this lock releases
 * - Released - Lock is no longer blocking other Lock's from being acquired
 *
 * @example
 *   class DBConnection {
 *     private mutex = new Mutex();
 *
 *     async insert() {
 *       const lock = this.mutex.acquire(); // Requesting a lock to be acquired
 *       await lock; // Waiting for the acquire request
 *
 *       try {
 *         // <put your async code here>
 *       } catch (e) {}
 *
 *       this.mutex.release();
 *       // Lock is released, from now on other locks can be acquired
 *     }
 *   }
 */
export class Mutex {
  private readonly _requests: Lock[] = [];

  private async _nextRequest() {
    this._requests[0]?.release();
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
