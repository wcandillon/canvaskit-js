import type { ColorFilter } from "canvaskit-wasm";

import { NativeFilter } from "../ImageFilter";

export abstract class ColorFilterJS
  extends NativeFilter<"ColorFilter">
  implements ColorFilter
{
  __type__ = "ColorFilter" as const;
}
