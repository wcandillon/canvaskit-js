import type { Color } from "./Data";

export class Paint {
  color: Color | null = null;
  constructor() {}

  setColor(color: Color) {
    this.color = color;
  }
}
