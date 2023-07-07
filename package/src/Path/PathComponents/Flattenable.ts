import type { TLookup } from "./Polyline";

export abstract class Flatennable {
  private _polyline: TLookup | null = null;

  abstract createPolyline(): TLookup;

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
