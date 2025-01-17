import type { TypedArray } from "./Uniform";
import { makeUniform } from "./Uniform";

export interface DrawingCommand {
  pipeline: GPURenderPipeline;
  bindGroup: GPUBindGroup;
  vertexCount: number;
}

export abstract class Drawable<Props extends Record<keyof Props, TypedArray>> {
  format: GPUTextureFormat;

  constructor(protected device: GPUDevice, protected props: Props) {
    this.format = navigator.gpu.getPreferredCanvasFormat();
  }

  protected createBindGroup(layout: GPUBindGroupLayout) {
    const uniform = makeUniform(this.props);
    const buffer = this.device.createBuffer({
      size: uniform.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(buffer, 0, uniform);
    return this.device.createBindGroup({
      layout,
      entries: [{ binding: 0, resource: { buffer } }],
    });
  }

  protected abstract createPipeline(): GPURenderPipeline;

  abstract getDrawingCommand(): DrawingCommand;
}
