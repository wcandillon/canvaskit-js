import type { ImageFilter } from "canvaskit-wasm";

import { HostObject } from "./HostObject";

export abstract class ImageFilterLite
  extends HostObject<ImageFilter>
  implements ImageFilter
{
  abstract toFilter(): string;
}

export class BlurImageFilter extends ImageFilterLite {
  constructor(private readonly sigmaX: number) {
    super();
  }

  toFilter(): string {
    return `blur(${this.sigmaX}px)`;
  }
}
