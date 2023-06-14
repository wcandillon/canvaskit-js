import type { MaskFilter } from "canvaskit-wasm";

import { NativeFilter } from "../ImageFilter";

export abstract class MaskFilterJS
  extends NativeFilter<"MaskFilter">
  implements MaskFilter
{
  constructor() {
    super("MaskFilter");
  }
}
