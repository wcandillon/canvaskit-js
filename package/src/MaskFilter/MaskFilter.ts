import type { ImageFilter } from "canvaskit-wasm";

import { NativeFilter } from "../ImageFilter";

export abstract class MaskFilterJS
  extends NativeFilter<ImageFilter>
  implements ImageFilter {}
