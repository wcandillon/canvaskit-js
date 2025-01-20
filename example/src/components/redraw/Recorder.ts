import type { BlendMode } from "../redraw-old";
import type { Matrix } from "../redraw-old/Data";

import { GPUBlendModes } from "./Paint";
import { Resources } from "./Resources";

interface PaintProps {
  useColor: number;
  useStroke: number;
  strokeWidth: number;
  color: Float32Array;
}

interface Child {
  sampler: GPUSampler;
  textureView: GPUTextureView;
}

interface Command {
  pipeline: GPURenderPipeline;
  bindGroups: GPUBindGroup[];
  vertexCount: number;
  instanceCount: number;
}

export class Recorder {
  private resources: Resources;
  private instances: Map<GPURenderPipeline, Record<string, unknown>[]> =
    new Map();
  private commands: Command[] = [];
  private dummyChild: Child;

  constructor(private device: GPUDevice, private resolution: Float32Array) {
    this.resources = Resources.getInstance(this.device);
    this.dummyChild = {
      sampler: this.device.createSampler({}),
      textureView: this.device
        .createTexture({
          size: { width: 1, height: 1 },
          format: "rgba8unorm",
          usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        })
        .createView(),
    };
  }

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
    const pipelineKey = `${id}-${blendMode}`;
    const pipeline = this.resources.createPipeline(
      pipelineKey,
      mod,
      mod,
      GPUBlendModes[blendMode]
    );
    if (!paint.useColor) {
      children.unshift(this.dummyChild);
    }
    if (!this.instances.has(pipeline)) {
      this.instances.set(pipeline, [
        { paint, matrix, resolution: this.resolution, ...props },
      ]);
    }
    const instances = this.instances.get(pipeline)!;
    this.commands.push({
      pipeline,
      vertexCount,
      instanceCount: instances.length,
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
      ({ pipeline, vertexCount, instanceCount, bindGroups }) => {
        passEncoder.setPipeline(pipeline);
        bindGroups.forEach((bindGroup, index) => {
          passEncoder.setBindGroup(index, bindGroup);
        });
        passEncoder.draw(vertexCount, 1, 0, instanceCount);
      }
    );
    passEncoder.end();
    this.device.queue.submit([commandEncoder.finish()]);
  }
}
