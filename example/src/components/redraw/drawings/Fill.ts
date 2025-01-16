import { makeUniform } from "../Uniform";

import { Drawable } from "./Drawable";

export const FillShader = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) originalPos: vec2f,
};

struct Info {
  color: vec4f,
};

@group(0) @binding(0) var<uniform> info: Info;

@vertex
fn vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  var pos = array<vec2f, 6>(
    vec2(-1.0, 1.0),   // Top-left
    vec2(1.0, 1.0),    // Top-right
    vec2(-1.0, -1.0),  // Bottom-left
    
    vec2(-1.0, -1.0),  // Bottom-left
    vec2(1.0, 1.0),    // Top-right
    vec2(1.0, -1.0)    // Bottom-right
  );
  
  return vec4f(pos[VertexIndex], 0.0, 1.0);
}

@fragment
fn fs() -> @location(0) vec4f {
  return info.color;
}`;

interface FillProps {
  color: Float32Array;
}

export class Fill extends Drawable<FillProps> {
  static pipeline: GPURenderPipeline;

  constructor(device: GPUDevice) {
    super(device);
    if (!Fill.pipeline) {
      Fill.pipeline = this.createPipeline();
    }
  }

  protected createPipeline() {
    const { device, format } = this;
    const module = device.createShaderModule({
      code: FillShader,
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
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
  }

  draw(passEncoder: GPURenderPassEncoder, data: FillProps) {
    console.log("Drawing Fill");
    passEncoder.setPipeline(Fill.pipeline);
    const uniform = makeUniform({
      color: data.color!,
    });
    const buffer = this.device.createBuffer({
      label: "uniforms for drawPaint",
      size: uniform.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(buffer, 0, uniform);
    const bindGroup = this.device.createBindGroup({
      layout: Fill.pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer } }],
    });
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6);
  }
}
