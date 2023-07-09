import type { FontMgr } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export class FontMgrJS extends HostObject<"FontMgr"> implements FontMgr {
  constructor(readonly familyNames: string[]) {
    super("FontMgr");
  }
  countFamilies(): number {
    return this.familyNames.length;
  }
  getFamilyName(index: number): string {
    return this.familyNames[index];
  }
}
