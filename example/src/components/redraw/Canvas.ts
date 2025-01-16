import { mat4 } from "wgpu-matrix";
import type { Point } from "canvaskit-wasm";

import type { Matrix } from "./Data";
import type { Paint } from "./Paint";
import { Circle, Fill } from "./drawings";

interface Context {
  matrix: Matrix;
}

export class Canvas {
  private contextes: Context[] = [{ matrix: mat4.identity() }];

  constructor(
    private device: GPUDevice,
    public passEncoder: GPURenderPassEncoder,
    private width: number,
    private height: number
  ) {}

  get ctx() {
    return this.contextes[this.contextes.length - 1];
  }

  save() {
    this.contextes.push({ matrix: this.ctx.matrix.slice() });
  }

  scale(x: number, y: number, z = 1) {
    const m = this.ctx.matrix;
    mat4.scale(m, [x, y, z], m);
  }

  rotate(rot: number, rx: number, ry: number, rz = 0) {
    const m = this.ctx.matrix;
    mat4.translate(m, [rx, ry, rz], m);
    mat4.rotateZ(m, rot, m);
    mat4.translate(m, [-rx, -ry, rz], m);
  }

  translate(x: number, y: number, z = 0) {
    const m = this.ctx.matrix;
    mat4.translate(m, [x, y, z], m);
  }

  restore() {
    this.contextes.pop();
  }

  fill(paint: Paint) {
    const { device } = this;
    const drawing = new Fill(device);
    drawing.draw(this.passEncoder, { color: paint.color! });
  }

  drawCircle(pos: Point, r: number, paint: Paint) {
    const { device } = this;
    const drawing = new Circle(device);
    drawing.draw(this.passEncoder, {
      resolution: Float32Array.of(this.width, this.height),
      center: pos,
      radius: Float32Array.of(r),
      matrix: this.ctx.matrix,
      color: paint.color!,
    });
  }
}
