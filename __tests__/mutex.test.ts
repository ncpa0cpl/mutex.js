import Mutex from "../src";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("Mutex", () => {
  it("should resolve locks only after the prev one is released an in the order they were created", async () => {
    const mutex = new Mutex();

    await mutex.acquire();

    const test1 = async () => {
      await mutex.acquire();
      return "1";
    };

    const test2 = async () => {
      await mutex.acquire();
      return "2";
    };

    const onTest1Finish = jest.fn();
    const onTest2Finish = jest.fn();

    test1().then(onTest1Finish);
    test2().then(onTest2Finish);

    await sleep(50);

    expect(onTest1Finish).toHaveBeenCalledTimes(0);
    expect(onTest2Finish).toHaveBeenCalledTimes(0);

    mutex.release();

    await sleep(1);

    expect(onTest1Finish).toHaveBeenCalledTimes(1);
    expect(onTest2Finish).toHaveBeenCalledTimes(0);

    expect(onTest1Finish).toHaveBeenLastCalledWith("1");

    mutex.release();

    await sleep(1);

    expect(onTest1Finish).toHaveBeenCalledTimes(1);
    expect(onTest2Finish).toHaveBeenCalledTimes(1);

    expect(onTest2Finish).toHaveBeenLastCalledWith("2");

    mutex.release();
  });
});
