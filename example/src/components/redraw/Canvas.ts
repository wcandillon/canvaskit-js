import { mat4 } from "wgpu-matrix";

import type { Matrix, Point } from "./Data";
import type { Paint } from "./Paint";
import { makeCircle, makeFill } from "./drawings";
import type { DrawingCommand } from "./drawings/Drawable";

interface Context {
  matrix: Matrix;
}

export class Canvas {
  private drawingCommands: DrawingCommand[] = [];

  private contextes: Context[] = [{ matrix: mat4.identity() }];

  constructor(private device: GPUDevice, private resolution: Float32Array) {}

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
    if (this.contextes.length > 0) {
      this.contextes.pop();
    }
  }

  fill(paint: Paint) {
    const { device } = this;
    this.drawingCommands.push(
      makeFill(device, paint.getBlendMode(), {
        color: paint.getColor()!,
      })
    );
  }

  drawCircle(pos: Point, radius: number, paint: Paint) {
    const { device } = this;
    this.drawingCommands.push(
      makeCircle(device, paint.getBlendMode(), {
        resolution: this.resolution,
        center: pos,
        radius,
        matrix: this.ctx.matrix,
        color: paint.getColor()!,
      })
    );
  }

  popDrawingCommands() {
    return this.drawingCommands.splice(0, this.drawingCommands.length);
  }
}
