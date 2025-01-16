export abstract class Drawable<T> {
  format: GPUTextureFormat;

  constructor(protected device: GPUDevice) {
    this.format = navigator.gpu.getPreferredCanvasFormat();
  }

  protected abstract createPipeline(): GPURenderPipeline;

  abstract draw(passEncoder: GPURenderPassEncoder, data: T): void;
}
