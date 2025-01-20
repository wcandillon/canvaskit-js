export class GPUResources {
  public modules: Map<string, GPUShaderModule> = new Map();
  public pipelines: Map<string, GPURenderPipeline> = new Map();
  public computePipelines: Map<string, GPUComputePipeline> = new Map();
  private static instances: Map<GPUDevice, GPUResources> = new Map();

  private constructor() {}

  static getInstance(device: GPUDevice) {
    if (!GPUResources.instances.has(device)) {
      GPUResources.instances.set(device, new GPUResources());
    }
    return GPUResources.instances.get(device)!;
  }
}
