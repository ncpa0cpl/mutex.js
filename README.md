# Mutex.js

Mutual Exclusion mechanism for Asynchronous JS Code.

## Mutex

Usage of the Mutex is plain and simple. Mutex class provided by this package has only two methods available, `acquire()` and `release()`.

- `acquire()` should be called and awaited before accessing the shared resource.

- `release()` should be called after acquiring and finishing the action on the shared resource.

### Example

The most simple usage of the Mutex class

```ts
import { Mutex } from "mutex.js";

class Foo {
  private readonly mutex = new Mutex();
  private sharedResource = {};

  async actionOnResource() {
    await this.mutex.acquire();

    try {
      // do something with `this.sharedResource`
    } finally {
      this.mutex.release();
    }
  }
}
```

A function that takes a callback and executes it with an acquired Mutex lock

```ts
import { Mutex } from "mutex.js";

const mutex = new Mutex();

async function transaction<R>(callback: () => Promise<R>) {
  await mutex.acquire();

  try {
    return await callback();
  } finally {
    mutex.release();
  }
}

// ...

const foo: string = await transaction(async () => {
  // some async code
  return "success";
});
```

## RWMutex

RWMutex (or read/write mutex) is specialized mutex type the allows for multiple read operations to happen simultaneously, but write operations are always atomic in relation to every other operation.

It works similarly to the regular Mutex, but each "acquire" and "release" must specify if the operation is a read or a write.

Methods it exposes are:

- `acquireWrite()` should be called and awaited before writing to the shared resource.

- `releaseWrite()` should be called after acquiring and finishing the write operation on the shared resource.

- `acquireRead()` should be called and awaited before reading the shared resource.

- `releaseRead()` should be called after acquiring and finishing the reading operation on the shared resource.

### Example

```ts
class DBConnection {
  private mutex = new RWMutex();

  // Writes to the DB
  async insert() {
    await this.mutex.acquireWrite();

    try {
      // <put your async code here>
    } finally {
      this.mutex.releaseWrite();
    }
  }

  // Read from the DB
  async select() {
    await this.mutex.acquireRead();

    try {
      // <put your async code here>
    } finally {
      this.mutex.releaseRead();
    }
  }
}
```

## What's a Mutual Exclusion (ie. Mutex)?

> **Mutual exclusion** is a property of process synchronization which states that **_“no two processes can exist in the critical section at any given point of time”_**. The term was first coined by Djikstra. Any process synchronization technique being used must satisfy the property of mutual exclusion, without which it would not be possible to get rid of a race condition.
>
> Source: <https://www.geeksforgeeks.org/mutual-exclusion-in-synchronization/>

In the context of this library this means that any code put between the `acquire()` and `release()` will only be executed if there is no other instance of code running that's also put between the `acquire()` and `release()` of the same Mutex object. And any attempts to run said code in that situation will be delayed until it is possible to run it, as per the mutual exclusion rule.
