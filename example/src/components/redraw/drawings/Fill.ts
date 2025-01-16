import type { Color } from "../Data";

import { Drawable } from "./Drawable";

interface FillProps {
  color: Color;
}

export const FillShader = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) originalPos: vec2f,
};

struct Props {
  color: vec4f,
};

@group(0) @binding(0) var<uniform> props: Props;

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
  return props.color;
}`;

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

  draw(passEncoder: GPURenderPassEncoder, props: FillProps) {
    passEncoder.setPipeline(Fill.pipeline);
    const bindGroup = this.createBindGroup(
      Fill.pipeline.getBindGroupLayout(0),
      props
    );
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6);
  }
}
