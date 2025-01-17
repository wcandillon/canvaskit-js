/* eslint-disable prefer-destructuring */
import type { Color, Matrix, Point } from "../Data";

import { Drawable } from "./Drawable";

interface CircleProps {
  resolution: Point;
  center: Point;
  radius: Float32Array;
  matrix: Matrix;
  color: Color;
}

const CircleShader = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) originalPos: vec2f,
};

struct Props {
  resolution: vec2f,
  center: vec2f,
  radius: f32,
  matrix: mat4x4f,
  color: vec4f,
};

@group(0) @binding(0) var<uniform> props: Props;

@vertex
fn vs(
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput {
  var pos = array<vec2f, 6>(
    vec2(props.center.x - props.radius, props.center.x - props.radius),   // Top-left
    vec2(props.center.x + props.radius, props.center.x - props.radius),    // Top-right
    vec2(props.center.x - props.radius, props.center.x + props.radius),  // Bottom-left
    
    vec2(props.center.x - props.radius, props.center.x + props.radius),  // Bottom-left
    vec2(props.center.x + props.radius, props.center.x - props.radius),    // Top-right
    vec2(props.center.x + props.radius, props.center.x + props.radius),  // Bottom-left
  );
  
  let vertexPos = pos[VertexIndex];

  // Multiply by a matrix
  let position = (props.matrix * vec4f(vertexPos, 0, 1)).xy;
  // convert the position from pixels to a 0.0 to 1.0 value
  let zeroToOne = position / props.resolution;
  // convert from 0 <-> 1 to 0 <-> 2
  let zeroToTwo = zeroToOne * 2.0;
  // covert from 0 <-> 2 to -1 <-> +1 (clip space)
  let flippedClipSpace = zeroToTwo - 1.0;
  // flip Y
  let clipSpace = flippedClipSpace * vec2f(1, -1);
  var output: VertexOutput;
  output.position = vec4f(clipSpace, 0.0, 1.0);
  output.originalPos = vertexPos;
  return output;
}

struct FragOut {
  @location(0) color : vec4f,
};

@fragment
fn fs(in: VertexOutput) -> FragOut {
  var out : FragOut;
  let d = length(in.position.xy);
  //if (d <= 1.0) {
    out.color = props.color;
  // } else {
  //   discard;
  // }
  return out;
}`;

export class Circle extends Drawable<CircleProps> {
  static pipeline: GPURenderPipeline;

  constructor(device: GPUDevice, props: CircleProps) {
    super(device, props);
    if (!Circle.pipeline) {
      Circle.pipeline = this.createPipeline();
    }
  }

  getDrawingCommand() {
    const x = this.props.center[0];
    const y = this.props.center[1];
    const r = this.props.radius[0];
    const vertexData = new Float32Array([
      x - r,
      y - r, // Top-left
      x + r,
      y + r, // Top-right
      x - r,
      x - r, // Bottom-left
      x - r,
      x - r, // Bottom-left
      x + r,
      y + r, // Top-right
      x + r,
      x - r, // Bottom-right
    ]);
    const vertexBuffer = this.device.createBuffer({
      label: "vertex buffer vertices",
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(vertexBuffer, 0, vertexData);
    const layout = Circle.pipeline.getBindGroupLayout(0);
    return {
      pipeline: Circle.pipeline,
      bindGroup: this.createBindGroup(layout),
      vertexBuffer,
      vertexCount: 6,
    };
  }

  createPipeline() {
    const { device } = this;
    const format = navigator.gpu.getPreferredCanvasFormat();
    const module = device.createShaderModule({
      code: CircleShader,
    });
    return device.createRenderPipeline({
      layout: "auto",
      label: "Fill",
      vertex: {
        module,
      },
      fragment: {
        module,
        targets: [
          {
            format,
            blend: {
              color: {
                operation: "add",
                srcFactor: "one",
                dstFactor: "one-minus-src-alpha",
              },
              alpha: {
                operation: "add",
                srcFactor: "one",
                dstFactor: "one-minus-src-alpha",
              },
            } as const,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
  }
}
