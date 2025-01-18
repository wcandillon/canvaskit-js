import { mat4 } from "wgpu-matrix";
import {
  getSizeAndAlignmentOfUnsizedArrayElement,
  makeStructuredView,
  type StructuredView,
  type VariableDefinition,
} from "webgpu-utils";

import type { Matrix, Point } from "./Data";
import type { Paint } from "./Paint/Paint";
import {
  CirclePropsDefinition,
  FillPropsDefinition,
  makeCircle,
  makeFill,
} from "./drawings";
import type { DrawingCommand } from "./drawings/Drawable";

interface InstanciatedDrawingCommand extends DrawingCommand {
  instance: number;
  bindGroup: GPUBindGroup;
}

interface Instances {
  props: Record<string, unknown>[];
  propsDefinition: VariableDefinition;
  bindGroup: GPUBindGroup | null;
  currentCount: number;
}

interface Context {
  matrix: Matrix;
}

export class Canvas {
  private pipelines: Map<GPURenderPipeline, Instances> = new Map();
  private drawingCommands: DrawingCommand[] = [];

  private contextes: Context[] = [{ matrix: mat4.identity() }];

  constructor(private device: GPUDevice, private resolution: Float32Array) {}

  get ctx() {
    return this.contextes[this.contextes.length - 1];
  }

  save() {
    this.contextes.push({ matrix: this.ctx.matrix.slice() });
  }

  scale(x: number, y: number, z = 1) {
    const m = this.ctx.matrix;
    mat4.scale(m, [x, y, z], m);
  }

  rotate(rot: number, rx: number, ry: number, rz = 0) {
    const m = this.ctx.matrix;
    mat4.translate(m, [rx, ry, rz], m);
    mat4.rotateZ(m, rot, m);
    mat4.translate(m, [-rx, -ry, rz], m);
  }

  translate(x: number, y: number, z = 0) {
    const m = this.ctx.matrix;
    mat4.translate(m, [x, y, z], m);
  }

  restore() {
    if (this.contextes.length > 0) {
      this.contextes.pop();
    }
  }

  fill(paint: Paint) {
    const { device } = this;
    const props = {
      color: paint.getColor()!,
    };
    this.addDrawingCommand(makeFill(device, paint), FillPropsDefinition, props);
  }

  drawCircle(pos: Point, radius: number, paint: Paint) {
    const { device } = this;
    const props = {
      resolution: this.resolution,
      center: pos,
      radius,
      matrix: this.ctx.matrix,
      color: paint.getColor()!,
    };
    this.addDrawingCommand(
      makeCircle(device, paint),
      CirclePropsDefinition,
      props
    );
  }

  private addDrawingCommand(
    command: DrawingCommand,
    propsDefinition: VariableDefinition,
    props: Record<string, unknown>
  ) {
    const { pipeline } = command;
    if (!this.pipelines.has(pipeline)) {
      this.pipelines.set(pipeline, {
        props: [],
        propsDefinition,
        bindGroup: null,
        currentCount: 0,
      });
    }
    const allProps = this.pipelines.get(pipeline)!;
    allProps.props.push(props);
    this.drawingCommands.push(command);
  }

  popDrawingCommands(): InstanciatedDrawingCommand[] {
    this.pipelines.forEach((resources, pipeline) => {
      const { props, propsDefinition } = resources;
      const { size } =
        getSizeAndAlignmentOfUnsizedArrayElement(propsDefinition);
      const storage = makeStructuredView(
        propsDefinition,
        new ArrayBuffer(props.length * size)
      );
      const storageBuffer = this.device.createBuffer({
        size: storage.arrayBuffer.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      storage.set(props);
      this.device.queue.writeBuffer(storageBuffer, 0, storage.arrayBuffer);
      resources.bindGroup = this.device.createBindGroup({
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
    const commands = this.drawingCommands
      .splice(0, this.drawingCommands.length)
      .map((command) => {
        const pipeline = this.pipelines.get(command.pipeline)!;
        const result = {
          ...command,
          instance: pipeline.currentCount,
          bindGroup: pipeline.bindGroup!,
        };
        pipeline.currentCount++;
        return result;
      });
    this.pipelines.clear();
    return commands;
  }
}
