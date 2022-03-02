export class Semaphore {
  private _counter = 0;
  private _signalListeners = new Map<symbol, () => void>();

  private sendSignal() {
    this._signalListeners.forEach((c) => c());
  }

  value(): number {
    return this._counter;
  }

  acquire(): void {
    this._counter++;
    this.sendSignal();
  }

  release(): void {
    this._counter--;
    this.sendSignal();
  }

  onSignal(callback: () => void): () => void {
    const id = Symbol();

    this._signalListeners.set(id, callback);

    return () => this._signalListeners.delete(id);
  }
}
