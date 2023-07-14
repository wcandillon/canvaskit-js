import type { FontMgr } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

import type { TypefaceJS } from "./Typeface";

export class FontMgrJS extends HostObject<"FontMgr"> implements FontMgr {
  constructor(readonly typefaces: TypefaceJS[]) {
    super("FontMgr");
  }
  countFamilies(): number {
    return this.typefaces.length;
  }
  getFamilyName(index: number): string {
    return this.typefaces[index].familyName;
  }
}
