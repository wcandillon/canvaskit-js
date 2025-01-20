import type { Matrix } from "./Data";
import { GPUResources } from "./GPUResources";

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
  private resources: GPUResources;

  constructor(private device: GPUDevice, private resolution: Float32Array) {
    this.resources = GPUResources.getInstance(this.device);
  }

  draw(
    vertex: GPURenderPipeline,
    paint: PaintProps,
    matrix: Matrix,
    uniforms: Record<string, unknown>,
    children: Child[],
    vertexCount: number
  ) {}

  flush(view: GPUTextureView) {}
}
