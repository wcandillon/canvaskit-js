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

struct FragOut {
  // This is the actual color to be written to the color attachment
  @location(0) color : vec4f,
};

@fragment
fn fs() -> FragOut {
  var out: FragOut;
  out.color = props.color;
  return out;
}`;

export class Fill extends Drawable<FillProps> {
  static pipeline: GPURenderPipeline;

  constructor(device: GPUDevice, props: FillProps) {
    super(device, props);
    if (!Fill.pipeline) {
      Fill.pipeline = this.createPipeline();
    }
  }

  getDrawingCommand() {
    const layout = Fill.pipeline.getBindGroupLayout(0);
    layout.label = "Circle Bind Group Layout";
    return {
      pipeline: Fill.pipeline,
      bindGroup: this.createBindGroup(layout),
      vertexCount: 6,
    };
  }

  createPipeline() {
    const { device } = this;
    const format = navigator.gpu.getPreferredCanvasFormat();
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
              } as const,
              alpha: {
                operation: "add",
                srcFactor: "one",
                dstFactor: "one-minus-src-alpha",
              } as const,
            },
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
  }
}
