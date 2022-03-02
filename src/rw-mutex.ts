import { Mutex } from "./mutex";
import { Semaphore } from "./semaphore";

/**
 * RWMutex class instances provide an API for creating
 * asynchronous mutual exclusion Locks for read and write operations.
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
 * There are two types of locks in a RWMutex:
 *
 * - Read Lock - read lock will prevent write operations from
 *   happening but allow other read operations
 * - Write Lock - write lock will prevent any other operations,
 *   there can be only one write operation at any time, and no
 *   read operation can happen when a write is in progress
 *
 * @example
 *   class DBConnection {
 *     private mutex = new RWMutex();
 *
 *     // Writes to the DB
 *     async insert() {
 *       await this.mutex.acquireWrite();
 *
 *       try {
 *         // <put your async code here>
 *       } catch (e) {}
 *
 *       this.mutex.releaseWrite();
 *     }
 *
 *     // Read from the DB
 *     async select() {
 *       await this.mutex.acquireRead();
 *
 *       try {
 *         // <put your async code here>
 *       } catch (e) {}
 *
 *       this.mutex.releaseRead();
 *     }
 *   }
 */
export class RWMutex {
  private _readers = new Semaphore();
  private _mutex = new Mutex();

  /**
   * Acquire a new read lock for this mutex, this lock will not
   * open until every write lock acquired prior to this one is
   * released. But multiple read locks can be opened at the same time.
   */
  async acquireRead(): Promise<void> {
    await this._mutex.acquire();
    this._readers.acquire();
    this._mutex.release();
  }

  /** Releases the read lock. */
  releaseRead(): void {
    this._readers.release();
  }

  /**
   * Acquire a new write lock for this mutex, this lock will not
   * open until every write and read lock acquired prior to this
   * one is released. Only one write lock can be acquired at a time.
   */
  async acquireWrite(): Promise<void> {
    await this._mutex.acquire();

    return new Promise<void>((resolve) => {
      if (this._readers.value() === 0) return resolve();

      const removeListener = this._readers.onSignal(() => {
        if (this._readers.value() === 0) {
          removeListener();
          resolve();
        }
      });
    });
  }

  /** Releases the write lock. */
  releaseWrite(): void {
    this._mutex.release();
  }
}
