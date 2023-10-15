export type RenderingContext =
  | OffscreenCanvasRenderingContext2D
  | CanvasRenderingContext2D;

export abstract class IndexedHostObject {
  public readonly id;

  constructor(prefix: string) {
    this.id = `${prefix}-${generateId()}`;
  }
}

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
