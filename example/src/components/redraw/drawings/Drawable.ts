import type { StructuredView } from "webgpu-utils";

import type { BlendMode } from "../Paint";
import type { TypedArray } from "../Data";

export interface DrawingCommand {
  pipeline: GPURenderPipeline;
  bindGroup: GPUBindGroup;
  vertexCount: number;
}

export abstract class Drawable<
  Props extends Record<keyof Props, TypedArray | number>
> {
  format: GPUTextureFormat;

  constructor(
    protected device: GPUDevice,
    protected propsView: StructuredView,
    protected props: Props
  ) {
    this.format = navigator.gpu.getPreferredCanvasFormat();
  }

  protected createBindGroup(layout: GPUBindGroupLayout) {
    this.propsView.set(this.props);
    const buffer = this.device.createBuffer({
      size: this.propsView.arrayBuffer.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(buffer, 0, this.propsView.arrayBuffer);
    return this.device.createBindGroup({
      layout,
      entries: [{ binding: 0, resource: { buffer } }],
    });
  }

  protected abstract createPipeline(blendMode: BlendMode): GPURenderPipeline;
  protected abstract createModule(): GPUShaderModule;

  abstract getDrawingCommand(blendMode: BlendMode): DrawingCommand;
}
