import type { EmulatedCanvas2D, Image } from "canvaskit-wasm";

export class EmulatedCanvas2DJS implements EmulatedCanvas2D {
  constructor(private readonly canvas: HTMLCanvasElement) {}
  dispose(): void {}
  decodeImage(_bytes: Uint8Array | ArrayBuffer): Image {
    throw new Error("Method not implemented.");
  }
  getContext(_type: string): CanvasRenderingContext2D | null {
    return this.canvas.getContext("2d");
  }
  loadFont(
    _bytes: Uint8Array | ArrayBuffer,
    _descriptors: Record<string, string>
  ): void {
    throw new Error("Method not implemented.");
  }
  makePath2D(str?: string | undefined): Path2D {
    return new Path2D(str);
  }
  toDataURL(codec?: string | undefined, quality?: number | undefined): string {
    return this.canvas.toDataURL(codec, quality);
  }
}
