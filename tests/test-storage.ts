export class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  writes = 0;

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
    this.writes += 1;
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
    this.writes += 1;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
    this.writes += 1;
  }

  resetWriteCount(): void {
    this.writes = 0;
  }
}
