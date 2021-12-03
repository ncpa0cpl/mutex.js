export declare class Lock {
    private readonly _awaiter;
    /** Opens/releases the Lock. */
    open: () => void;
    constructor();
    /** Returns a promise that resolves when the Lock opens. */
    wait(): Promise<void>;
}
