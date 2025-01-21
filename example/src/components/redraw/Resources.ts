export class Resources {
  private modules: Map<string, GPUShaderModule> = new Map();
  private pipelines: Map<string, GPURenderPipeline> = new Map();
  private dummyTexture: GPUTexture;

  private static instances: Map<GPUDevice, Resources> = new Map();

  private constructor(private device: GPUDevice) {
    this.dummyTexture = this.device.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
  }

  createModule(id: string, code: string) {
    if (!this.modules.has(id)) {
      this.modules.set(id, this.device.createShaderModule({ code }));
    }
    return this.modules.get(id)!;
  }

  createPipeline(
    id: string,
    vertex: GPUShaderModule,
    fragment: GPUShaderModule,
    blendMode: GPUBlendState
  ) {
    if (!this.pipelines.has(id)) {
      const format = navigator.gpu.getPreferredCanvasFormat();
      const pipeline = this.device.createRenderPipeline({
        layout: "auto",
        label: id,
        vertex: {
          module: vertex,
        },
        fragment: {
          module: fragment,
          targets: [
            {
              format,
              blend: blendMode,
            },
          ],
        },
        primitive: {
          topology: "triangle-list",
        },
      });
      this.pipelines.set(id, pipeline);
    }
    return this.pipelines.get(id)!;
  }

  getDummyTexture() {
    return this.dummyTexture;
  }

  static getInstance(device: GPUDevice) {
    if (!Resources.instances.has(device)) {
      Resources.instances.set(device, new Resources(device));
    }
    return Resources.instances.get(device)!;
  }
}
