import type { Polyline } from "./Polyline";

export abstract class Flatennable {
  private _polyline: Polyline | null = null;

  abstract createPolyline(): Polyline;

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
