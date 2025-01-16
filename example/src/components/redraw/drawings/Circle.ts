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
    vec2(-1.0, 1.0),   // Top-left
    vec2(1.0, 1.0),    // Top-right
    vec2(-1.0, -1.0),  // Bottom-left
    
    vec2(-1.0, -1.0),  // Bottom-left
    vec2(1.0, 1.0),    // Top-right
    vec2(1.0, -1.0)    // Bottom-right
  );
  
  let vertexPos = pos[VertexIndex];
  let offset = vec2f(
    (props.center.x / props.resolution.x) * 2.0 - 1.0,
    -((props.center.y / props.resolution.y) * 2.0 - 1.0)  // Flip Y and shift
  );
  let adjustedPos =  vertexPos * (props.radius * 2.0 / props.resolution) + vec2f(0.5, -0.5) + offset;
  var output: VertexOutput;
  output.position = props.matrix * vec4f(adjustedPos, 0.0, 1.0);
  output.originalPos = vertexPos;
  return output;
}

@fragment
fn fs(in: VertexOutput) -> @location(0) vec4f {
  let dist = length(in.originalPos);
  if (dist <= 1.0) {
    return props.color;
  }
  discard;
  return vec4f(0.0, 0.0, 0.0, 0.0);
}`;

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
            },
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
  }

  draw(passEncoder: GPURenderPassEncoder, props: CircleProps) {
    passEncoder.setPipeline(Circle.pipeline);
    const bindGroup = this.createBindGroup(
      Circle.pipeline.getBindGroupLayout(0),
      props
    );
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6);
  }
}
