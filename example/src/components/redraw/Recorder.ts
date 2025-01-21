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
import { FillVertex } from "./Drawings/Fill";

interface PaintProps {
  useColor: number;
  style: number;
  color: Float32Array;
  strokeWidth: number;
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

export abstract class Drawable {
  abstract setup(device: GPUDevice): void;
  abstract compute(commandEncoder: GPUCommandEncoder): void;
  abstract draw(passEncoder: GPURenderPassEncoder): void;
}

export class Recorder {
  private resources: Resources;
  private sampler: GPUSampler;
  private instances: Map<GPURenderPipeline, Instance> = new Map();
  private drawables: Drawable[] = [];
  private commands: (Command | Drawable)[] = [];

  constructor(private device: GPUDevice, private resolution: Float32Array) {
    this.resources = Resources.getInstance(this.device);
    this.sampler = this.device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    });
  }

  execute(drawable: Drawable) {
    this.drawables.push(drawable);
    this.commands.push(drawable);
    drawable.setup(this.device);
  }

  fill(
    id: string,
    shader: string,
    blendMode: BlendMode,
    props: Record<string, unknown> | null,
    children: GPUTexture[] = []
  ) {
    const vertex = this.resources.createModule("fill-vertex", FillVertex);
    const fragment = this.resources.createModule(`${id}-frag`, shader);
    const defs = makeShaderDataDefinitions(shader);
    const pipelineKey = `${id}-${blendMode}`;
    const pipeline = this.resources.createPipeline(
      pipelineKey,
      vertex,
      fragment,
      GPUBlendModes[blendMode]
    );
    const bindGroups: GPUBindGroup[] = [];
    if (props) {
      const propsView = makeStructuredView(defs.uniforms.props);
      propsView.set(props);
      const buffer = this.device.createBuffer({
        size: propsView.arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this.device.queue.writeBuffer(buffer, 0, propsView.arrayBuffer);
      const uniformBindGroup = this.device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: {
              buffer,
            },
          },
        ],
      });
      bindGroups.push(uniformBindGroup);
    }
    children.map((child) => {
      const bindGroup = this.device.createBindGroup({
        layout: pipeline.getBindGroupLayout(bindGroups.length),
        entries: [
          {
            binding: 0,
            resource: this.sampler,
          },
          {
            binding: 1,
            resource: child.createView(),
          },
        ],
      });
      bindGroups.push(bindGroup);
    });
    this.commands.push({
      pipeline,
      vertexCount: 3,
      // no instanciation here
      instanceIndex: -1,
      bindGroups,
    });
  }

  draw(
    id: string,
    shader: string,
    blendMode: BlendMode,
    paint: PaintProps,
    matrix: Matrix,
    props: Record<string, unknown>,
    children: GPUTexture[],
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
              resource: this.sampler,
            },
            {
              binding: 1,
              resource: child.createView(),
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
    this.drawables.forEach((drawable) => {
      drawable.compute(commandEncoder);
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
    this.commands.forEach((cmdOrDrawable) => {
      if (cmdOrDrawable instanceof Drawable) {
        cmdOrDrawable.draw(passEncoder);
      } else {
        const { pipeline, vertexCount, instanceIndex, bindGroups } =
          cmdOrDrawable;
        // Whether the command is using instanciation or not
        passEncoder.setPipeline(pipeline);
        if (instanceIndex === -1) {
          bindGroups.forEach((bindGroup, index) => {
            passEncoder.setBindGroup(index, bindGroup);
          });
          passEncoder.draw(vertexCount);
        } else {
          const instance = this.instances.get(pipeline)!;
          passEncoder.setBindGroup(0, instance.bindGroup!);
          bindGroups.forEach((bindGroup, index) => {
            passEncoder.setBindGroup(index + 1, bindGroup);
          });
          passEncoder.draw(vertexCount, 1, 0, instanceIndex);
        }
      }
    });
    passEncoder.end();
    this.device.queue.submit([commandEncoder.finish()]);
    this.instances.clear();
    this.commands.splice(0, this.commands.length);
    this.drawables.splice(0, this.drawables.length);
  }
}
