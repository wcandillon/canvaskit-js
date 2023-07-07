import type { LUT } from "./Polyline";

export abstract class Flatennable {
  private _polyline: LUT | null = null;

  abstract createPolyline(): LUT;

  get polyline() {
    if (this._polyline === null) {
      this._polyline = this.createPolyline();
    }
    return this._polyline;
  }

  tAtLength(length: number) {
    return this.polyline.tAtLength(length);
  }

  length(): number {
    return this.polyline.length();
  }
}
