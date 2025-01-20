export class Resources {
  private vertex: Map<string, GPUShaderModule> = new Map();
  private fragment: Map<string, GPUShaderModule> = new Map();
  private pipelines: Map<string, GPURenderPipeline> = new Map();
  //private computePipelines: Map<string, GPUComputePipeline> = new Map();

  private static instances: Map<GPUDevice, Resources> = new Map();

  private constructor(private device: GPUDevice) {}

  createVertexModule(id: string, code: string) {
    if (!this.vertex.has(id)) {
      this.vertex.set(id, this.device.createShaderModule({ code }));
    }
    return this.vertex.get(id)!;
  }

  createFragmentModule(id: string, code: string) {
    if (!this.fragment.has(id)) {
      this.fragment.set(id, this.device.createShaderModule({ code }));
    }
    return this.fragment.get(id)!;
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
