import type { BlendMode } from "../redraw-old";
import type { Matrix } from "../redraw-old/Data";

import { Resources } from "./Resources";

interface PaintProps {
  useColor: number;
  useStroke: number;
  strokeWidth: number;
  color: Float32Array;
}

interface Child {
  sampler: GPUSampler;
  texture: GPUTextureView;
}

export class Recorder {
  private resources: Resources;

  constructor(private device: GPUDevice, private resolution: Float32Array) {
    this.resources = Resources.getInstance(this.device);
  }

  draw(
    vet: GPUShaderModule,
    frag: GPUShaderModule,
    blendMode: BlendMode,
    paint: PaintProps,
    matrix: Matrix,
    uniforms: Record<string, unknown>,
    children: Child[],
    vertexCount: number
  ) {}

  flush(view: GPUTextureView) {}
}
