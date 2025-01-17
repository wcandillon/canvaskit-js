import type { StructuredView } from "webgpu-utils";

import type { ImageFilter, Paint } from "../Paint";
import { GPUBlendModes } from "../Paint";

export interface DrawingCommand {
  pipeline: GPURenderPipeline;
  bindGroup: GPUBindGroup;
  vertexCount: number;
  imageFilter: ImageFilter | null;
}

export class GPUResources {
  public modules: Map<string, GPUShaderModule> = new Map();
  public pipelines: Map<string, GPURenderPipeline> = new Map();
  private static instances: Map<GPUDevice, GPUResources> = new Map();

  private constructor() {}

  static getInstance(device: GPUDevice) {
    if (!GPUResources.instances.has(device)) {
      GPUResources.instances.set(device, new GPUResources());
    }
    return GPUResources.instances.get(device)!;
  }
}

const createBindGroup = (
  device: GPUDevice,
  layout: GPUBindGroupLayout,
  propsView: StructuredView
) => {
  const buffer = device.createBuffer({
    size: propsView.arrayBuffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, propsView.arrayBuffer);
  return device.createBindGroup({
    layout,
    entries: [{ binding: 0, resource: { buffer } }],
  });
};

export const makeDrawable = <T>(
  device: GPUDevice,
  key: string,
  module: string,
  paint: Paint,
  propsView: StructuredView,
  props: T,
  vertexCount: number
) => {
  const resources = GPUResources.getInstance(device);
  if (!resources.modules.has(key)) {
    resources.modules.set(key, device.createShaderModule({ code: module }));
  }
  const blendMode = paint.getBlendMode();
  const mod = resources.modules.get(key)!;
  const pipelineKey = `${key}-${blendMode}`;
  if (!resources.pipelines.has(pipelineKey)) {
    const format = navigator.gpu.getPreferredCanvasFormat();
    const pipeline = device.createRenderPipeline({
      layout: "auto",
      label: "Fill",
      vertex: {
        module: mod,
      },
      fragment: {
        module: mod,
        targets: [
          {
            format,
            blend: GPUBlendModes[blendMode],
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
    resources.pipelines.set(pipelineKey, pipeline);
  }
  const pipeline = resources.pipelines.get(pipelineKey)!;
  const layout = pipeline.getBindGroupLayout(0);
  layout.label = "Circle Bind Group Layout";
  propsView.set(props);
  return {
    pipeline,
    bindGroup: createBindGroup(device, layout, propsView),
    vertexCount,
    imageFilter: paint.getImageFilter(),
  };
};
