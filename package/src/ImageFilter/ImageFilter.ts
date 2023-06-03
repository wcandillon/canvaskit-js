import type { ImageFilter } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export abstract class ImageFilterJS
  extends HostObject<ImageFilter>
  implements ImageFilter
{
  abstract getFilter(): string;
}
