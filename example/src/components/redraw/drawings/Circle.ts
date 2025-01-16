import type { Color, Matrix, Point } from "../Data";
import { makeUniform } from "../Uniform";

import { Drawable } from "./Drawable";

const CircleShader = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) originalPos: vec2f,
};

struct Info {
  resolution: vec2f,
  center: vec2f,
  radius: f32,
  matrix: mat4x4f,
  color: vec4f,
};

@group(0) @binding(0) var<uniform> info: Info;

@vertex
fn vs(
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput {
  var pos = array<vec2f, 6>(
    vec2(-1.0, 1.0),   // Top-left
    vec2(1.0, 1.0),    // Top-right
    vec2(-1.0, -1.0),  // Bottom-left
    
    vec2(-1.0, -1.0),  // Bottom-left
    vec2(1.0, 1.0),    // Top-right
    vec2(1.0, -1.0)    // Bottom-right
  );
  
  let vertexPos = pos[VertexIndex];
  let offset = vec2f(
    (info.center.x / info.resolution.x) * 2.0 - 1.0,
    -((info.center.y / info.resolution.y) * 2.0 - 1.0)  // Flip Y and shift
  );
  let adjustedPos =  vertexPos * (info.radius * 2.0 / info.resolution) + vec2f(0.5, -0.5) + offset;
  var output: VertexOutput;
  output.position = info.matrix * vec4f(adjustedPos, 0.0, 1.0);
  output.originalPos = vertexPos;
  return output;
}

@fragment
fn fs(in: VertexOutput) -> @location(0) vec4f {
  let dist = length(in.originalPos);
  if (dist <= 1.0) {
    return info.color;
  }
  return vec4f(0.0, 0.0, 0.0, 0.0);
}`;

interface CircleProps {
  resolution: Point;
  center: Point;
  radius: Float32Array;
  matrix: Matrix;
  color: Color;
}

export class Circle extends Drawable<CircleProps> {
  static pipeline: GPURenderPipeline;

  constructor(device: GPUDevice) {
    super(device);
    if (!Circle.pipeline) {
      Circle.pipeline = this.createPipeline();
    }
  }

  protected createPipeline() {
    const { device, format } = this;
    const module = device.createShaderModule({
      code: CircleShader,
    });
    return device.createRenderPipeline({
      layout: "auto",
      label: "Circle",
      vertex: {
        module,
      },
      fragment: {
        module,
        targets: [
          {
            format,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
  }

  draw(passEncoder: GPURenderPassEncoder, data: CircleProps) {
    passEncoder.setPipeline(Circle.pipeline);
    const uniform = makeUniform(data);
    const buffer = this.device.createBuffer({
      label: "uniforms for drawPaint",
      size: uniform.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(buffer, 0, uniform);
    const bindGroup = this.device.createBindGroup({
      layout: Circle.pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer } }],
    });
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6);
  }
}
// TODO: use float32 for uniform
// Use css color parsing
