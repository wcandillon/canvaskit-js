export class Resources {
  private modules: Map<string, GPUShaderModule> = new Map();
  private pipelines: Map<string, GPURenderPipeline> = new Map();
  //private computePipelines: Map<string, GPUComputePipeline> = new Map();

  private static instances: Map<GPUDevice, Resources> = new Map();

  private constructor(private device: GPUDevice) {}

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

  static getInstance(device: GPUDevice) {
    if (!Resources.instances.has(device)) {
      Resources.instances.set(device, new Resources(device));
    }
    return Resources.instances.get(device)!;
  }
}
