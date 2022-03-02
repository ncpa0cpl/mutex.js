export class OrderedMap<K, V> {
  private _entries: Array<[key: K, value: V]> = [];

  get(key: K): V | undefined {
    const entry = this._entries.find(([k]) => k === key);

    return entry ? entry[1] : undefined;
  }

  set(key: K, value: V): void {
    const entry = this._entries.find(([k]) => k === key);

    if (entry) {
      entry[1] = value;
    } else {
      this._entries.push([key, value]);
    }
  }

  delete(key: K): void {
    const index = this._entries.findIndex(([k]) => k === key);

    if (index !== -1) {
      this._entries.splice(index, 1);
    }
  }

  values(): IterableIterator<V> {
    return this._entries.map(([, value]) => value)[Symbol.iterator]();
  }
}
