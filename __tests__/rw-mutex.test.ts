import { RWMutex } from "../src";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const isResolved = async (promise: Promise<any>) => {
  let resolved = false;
  promise.finally(() => (resolved = true));
  await sleep(25);
  return resolved;
};

describe("RWMutex", () => {
  it("should allow for multiple read operations at the same time", async () => {
    const rwMutex = new RWMutex();

    const readOperation1 = jest.fn(async () => {
      await rwMutex.acquireRead();
      return 1;
    });
    const readOperation2 = jest.fn(async () => {
      await rwMutex.acquireRead();
      return 2;
    });
    const readOperation3 = jest.fn(async () => {
      await rwMutex.acquireRead();
      return 3;
    });

    const rop1 = readOperation1();
    const rop2 = readOperation2();
    const rop3 = readOperation3();

    await Promise.all([
      expect(rop1).resolves.toEqual(1),
      expect(rop2).resolves.toEqual(2),
      expect(rop3).resolves.toEqual(3),
    ]);
  });

  it("should prevent reads until write is finished", async () => {
    const rwMutex = new RWMutex();

    await rwMutex.acquireWrite();

    const readOperation1 = jest.fn(async () => {
      await rwMutex.acquireRead();
      return 1;
    });
    const readOperation2 = jest.fn(async () => {
      await rwMutex.acquireRead();
      return 2;
    });
    const readOperation3 = jest.fn(async () => {
      await rwMutex.acquireRead();
      return 3;
    });

    const rop1 = readOperation1();
    const rop2 = readOperation2();
    const rop3 = readOperation3();

    await sleep(10);

    expect(await isResolved(rop1)).toEqual(false);
    expect(await isResolved(rop2)).toEqual(false);
    expect(await isResolved(rop3)).toEqual(false);

    rwMutex.releaseWrite();

    await sleep(10);

    expect(await isResolved(rop1)).toEqual(true);
    expect(await isResolved(rop2)).toEqual(true);
    expect(await isResolved(rop3)).toEqual(true);

    await Promise.all([
      expect(rop1).resolves.toEqual(1),
      expect(rop2).resolves.toEqual(2),
      expect(rop3).resolves.toEqual(3),
    ]);
  });

  it("read operations should prevent write operations until all previous reads are finished", async () => {
    const rwMutex = new RWMutex();

    rwMutex.acquireRead();
    rwMutex.acquireRead();
    rwMutex.acquireRead();

    const writeLock = rwMutex.acquireWrite();

    rwMutex.acquireRead();
    rwMutex.acquireRead();

    expect(await isResolved(writeLock)).toEqual(false);
    rwMutex.releaseRead();
    expect(await isResolved(writeLock)).toEqual(false);
    rwMutex.releaseRead();
    expect(await isResolved(writeLock)).toEqual(false);
    rwMutex.releaseRead();
    expect(await isResolved(writeLock)).toEqual(true);
  });
});
