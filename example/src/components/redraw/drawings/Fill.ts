import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";

import type { Color } from "../Data";
import type { BlendMode } from "../Paint";

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

const defs = makeShaderDataDefinitions(FillShader);
const propsView = makeStructuredView(defs.uniforms.props);

export class Fill extends Drawable<FillProps> {
  static module: GPUShaderModule | null = null;
  static pipeline: Map<BlendMode, GPURenderPipeline> = new Map();

  constructor(device: GPUDevice, props: FillProps) {
    super(device, propsView, props);
    if (Fill.module === null) {
      Fill.module = this.createModule();
    }
  }

  getDrawingCommand(blendMode: BlendMode) {
    const pipeline = this.createPipeline(blendMode);
    const layout = pipeline.getBindGroupLayout(0);
    layout.label = "Circle Bind Group Layout";
    return {
      pipeline,
      bindGroup: this.createBindGroup(layout),
      vertexCount: 6,
    };
  }

  protected createModule(): GPUShaderModule {
    const { device } = this;
    return device.createShaderModule({
      code: FillShader,
    });
  }

  createPipeline(blendMode: BlendMode) {
    const cachedPipeline = Fill.pipeline.get(blendMode);
    if (cachedPipeline) {
      return cachedPipeline;
    }
    const { device } = this;
    const format = navigator.gpu.getPreferredCanvasFormat();
    const module = device.createShaderModule({
      code: FillShader,
    });
    const pipeline = device.createRenderPipeline({
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
    Fill.pipeline.set(blendMode, pipeline);
    return pipeline;
  }
}
