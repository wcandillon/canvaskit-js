import {
  getSizeAndAlignmentOfUnsizedArrayElement,
  makeShaderDataDefinitions,
  makeStructuredView,
} from "webgpu-utils";
import type { VariableDefinition } from "webgpu-utils";

import type { BlendMode } from "../redraw-old";
import type { Matrix } from "../redraw-old/Data";

import { GPUBlendModes } from "./Paint";
import { Resources } from "./Resources";

interface PaintProps {
  useColor: number;
  style: number;
  color: Float32Array;
  strokeWidth: number;
}

interface Child {
  sampler: GPUSampler;
  textureView: GPUTextureView;
}

interface Command {
  pipeline: GPURenderPipeline;
  bindGroups: GPUBindGroup[];
  vertexCount: number;
  instanceIndex: number;
}

interface Instance {
  props: Record<string, unknown>[];
  propsView: VariableDefinition;
  bindGroup: GPUBindGroup | null;
}

export class Recorder {
  private resources: Resources;
  private instances: Map<GPURenderPipeline, Instance> = new Map();
  private commands: Command[] = [];

  constructor(private device: GPUDevice, private resolution: Float32Array) {
    this.resources = Resources.getInstance(this.device);
  }

  fill(
    id: string,
    shader: string,
    blendMode: BlendMode,
    props: Record<string, unknown>,
    children: Child[]
  ) {}

  draw(
    id: string,
    shader: string,
    blendMode: BlendMode,
    paint: PaintProps,
    matrix: Matrix,
    props: Record<string, unknown>,
    children: Child[],
    vertexCount: number
  ) {
    const mod = this.resources.createModule(id, shader);
    const defs = makeShaderDataDefinitions(shader);
    const propsView = defs.storages.instancesProps;
    const pipelineKey = `${id}-${blendMode}`;
    const pipeline = this.resources.createPipeline(
      pipelineKey,
      mod,
      mod,
      GPUBlendModes[blendMode]
    );
    if (paint.useColor) {
      children.unshift(this.resources.getDummyTexture());
    }
    if (!this.instances.has(pipeline)) {
      this.instances.set(pipeline, {
        props: [],
        propsView,
        bindGroup: null,
      });
    }
    const instances = this.instances.get(pipeline)!;
    instances.props.push({
      ...paint,
      matrix,
      resolution: this.resolution,
      ...props,
    });
    this.commands.push({
      pipeline,
      vertexCount,
      instanceIndex: instances.props.length - 1,
      bindGroups: children.map((child, index) => {
        return this.device.createBindGroup({
          layout: pipeline.getBindGroupLayout(index + 1),
          entries: [
            {
              binding: 0,
              resource: child.sampler,
            },
            {
              binding: 1,
              resource: child.textureView,
            },
          ],
        });
      }),
    });
  }

  flush(texture: GPUTexture) {
    this.instances.forEach((instances, pipeline) => {
      const { props, propsView } = instances;
      const { size } = getSizeAndAlignmentOfUnsizedArrayElement(propsView);
      const storage = makeStructuredView(
        propsView,
        new ArrayBuffer(props.length * size)
      );
      const storageBuffer = this.device.createBuffer({
        size: storage.arrayBuffer.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      storage.set(props);
      this.device.queue.writeBuffer(storageBuffer, 0, storage.arrayBuffer);
      instances.bindGroup = this.device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: {
              buffer: storageBuffer,
            },
          },
        ],
      });
    });
    const commandEncoder = this.device.createCommandEncoder({
      label: "Surface encoder",
    });
    const view = texture.createView();
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view,
          clearValue: [0, 0, 0, 0], // Clear to transparent
          loadOp: "clear",
          storeOp: "store",
        } as const,
      ],
    });
    this.commands.forEach(
      ({ pipeline, vertexCount, instanceIndex, bindGroups }) => {
        passEncoder.setPipeline(pipeline);
        const instance = this.instances.get(pipeline)!;
        passEncoder.setBindGroup(0, instance.bindGroup!);
        bindGroups.forEach((bindGroup, index) => {
          passEncoder.setBindGroup(index + 1, bindGroup);
        });
        passEncoder.draw(vertexCount, 1, 0, instanceIndex);
      }
    );
    passEncoder.end();
    this.device.queue.submit([commandEncoder.finish()]);
    console.log("submitted");
    this.instances.clear();
    this.commands = [];
  }
}
