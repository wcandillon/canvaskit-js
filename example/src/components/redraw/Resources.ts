export class Resources {
  public modules: Map<string, GPUShaderModule> = new Map();
  public pipelines: Map<string, GPURenderPipeline> = new Map();
  public computePipelines: Map<string, GPUComputePipeline> = new Map();
  private static instances: Map<GPUDevice, Resources> = new Map();

  private constructor() {}

  static getInstance(device: GPUDevice) {
    if (!Resources.instances.has(device)) {
      Resources.instances.set(device, new Resources());
    }
    return Resources.instances.get(device)!;
  }
}
