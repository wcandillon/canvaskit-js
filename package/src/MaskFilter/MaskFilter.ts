import type { MaskFilter } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export abstract class MaskFilterJS
  extends HostObject<MaskFilter>
  implements MaskFilter
{
  abstract getFilter(): string;
}
