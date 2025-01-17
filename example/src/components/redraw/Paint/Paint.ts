import { ColorFactory, type Color } from "../Data";

import { BlendMode } from "./BlendMode";
import type { ImageFilter } from "./ImageFilter";

export class Paint {
  private color: Color | null = null;
  private alpha = 1;
  private blendMode = BlendMode.SrcOver;
  private imageFilter: ImageFilter | null = null;

  constructor() {}

  setImageFilter(imageFilter: ImageFilter) {
    this.imageFilter = imageFilter;
  }

  getImageFilter() {
    return this.imageFilter;
  }

  setColor(color: Float32Array | string) {
    this.color = color instanceof Float32Array ? color : ColorFactory(color);
  }

  getColor() {
    return this.color;
  }

  setAlpha(alpha: number) {
    this.alpha = alpha;
    if (this.color) {
      this.color[3] = alpha;
    }
  }

  getAlpha() {
    return this.alpha;
  }

  setBlendMode(blendMode: BlendMode) {
    this.blendMode = blendMode;
  }

  getBlendMode() {
    return this.blendMode;
  }

  copy() {
    const paint = new Paint();
    paint.color = this.color;
    paint.alpha = this.alpha;
    paint.blendMode = this.blendMode;
    paint.imageFilter = this.imageFilter;
    return paint;
  }
}
