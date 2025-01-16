import type { TypedArray } from "./Uniform";
import { makeUniform } from "./Uniform";

export abstract class Drawable<T> {
  format: GPUTextureFormat;

  constructor(protected device: GPUDevice) {
    this.format = navigator.gpu.getPreferredCanvasFormat();
  }

  protected createBindGroup<Props extends Record<keyof Props, TypedArray>>(
    layout: GPUBindGroupLayout,
    props: Props
  ) {
    const uniform = makeUniform(props);
    const buffer = this.device.createBuffer({
      label: "uniforms for drawPaint",
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

  abstract draw(passEncoder: GPURenderPassEncoder, data: T): void;
}
