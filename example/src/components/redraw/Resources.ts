export class Resources {
  private modules = new Map<string, GPUShaderModule>();
  private pipelines = new Map<string, GPURenderPipeline>();
  private computePipelines = new Map<string, GPUComputePipeline>();
  private textures = new Map<string, GPUTexture>();
  private buffers = new Map<string, GPUBuffer>();
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

  createComputePipeline(id: string, mod: GPUShaderModule) {
    if (!this.computePipelines.has(id)) {
      console.log("createComputePipeline", id);
      const pipeline = this.device.createComputePipeline({
        layout: "auto",
        compute: {
          module: mod,
        },
      });
      this.computePipelines.set(id, pipeline);
    }
    return this.computePipelines.get(id)!;
  }

  createTexture(id: string, descriptor: GPUTextureDescriptor) {
    if (!this.textures.has(id)) {
      const texture = this.device.createTexture(descriptor);
      this.textures.set(id, texture);
    }
    return this.textures.get(id)!;
  }

  createPipeline(
    id: string,
    vertex: GPUShaderModule,
    fragment: GPUShaderModule,
    blend?: GPUBlendState
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
              blend,
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

  createBuffer(id: string, data: Uint32Array, usage: GPUBufferUsageFlags) {
    if (!this.buffers.has(id)) {
      const buffer = this.device.createBuffer({
        size: data.byteLength,
        usage,
        mappedAtCreation: true,
      });
      new Uint8Array(buffer.getMappedRange()).set(data);
      buffer.unmap();
      this.buffers.set(id, buffer);
    }
    return this.buffers.get(id)!;
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
