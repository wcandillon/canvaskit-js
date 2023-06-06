import type { EmbindObject } from "canvaskit-wasm";

export abstract class HostObject<T extends HostObject<T>>
  implements EmbindObject<T>
{
  clone(): T {
    throw new Error("Method not implemented.");
  }
  delete(): void {}
  deleteLater(): void {}
  isAliasOf(_other: unknown): boolean {
    throw new Error("Method not implemented.");
  }
  isDeleted(): boolean {
    return false;
  }
}

export abstract class IndexedHostObject<
  T extends HostObject<T>
> extends HostObject<T> {
  public readonly id;

  constructor(prefix: string) {
    super();
    this.id = `${prefix}-${
      Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
    }`;
  }
}
