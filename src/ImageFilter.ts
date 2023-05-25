import type { ImageFilter } from "canvaskit-wasm";

import { HostObject } from "./HostObject";

export abstract class ImageFilterLite
  extends HostObject<ImageFilter>
  implements ImageFilter
{
  abstract toFilter(ctx: CanvasRenderingContext2D): string;
}
