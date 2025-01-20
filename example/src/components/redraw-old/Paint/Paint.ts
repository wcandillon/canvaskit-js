import { ColorFactory, type Color } from "../Data";
import type { ImageFilter } from "../imageFilters";
import type { Shader } from "../shaders";

import { BlendMode } from "./BlendMode";

export enum PaintStyle {
  Fill,
  Stroke,
}

export class Paint {
  private imageFilter: ImageFilter | null = null;
  private shader: Shader | null = null;
  private blendMode = BlendMode.SrcOver;
  protected style = PaintStyle.Fill;
  protected strokeWidth = 1;
  protected color: Color = Float32Array.of(0, 0, 0, 1);
  protected alpha = 1;

  setImageFilter(imageFilter: ImageFilter | null) {
    this.imageFilter = imageFilter;
  }

  getImageFilter() {
    return this.imageFilter;
  }

  setShader(shader: Shader | null) {
    this.shader = shader;
  }

  getShader() {
    return this.shader;
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

  setPaintStyle(style: PaintStyle) {
    this.style = style;
  }

  getPaintStyle() {
    return this.style;
  }

  setStrokeWidth(width: number) {
    this.strokeWidth = width;
  }

  getStrokeWidth() {
    return this.strokeWidth;
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
    paint.shader = this.shader;
    paint.style = this.style;
    paint.strokeWidth = this.strokeWidth;
    return paint;
  }
}
