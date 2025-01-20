import type { Color } from "../Data";
import { GPUResources } from "../GPUResources";

import type { Shader } from "./Shader";

const ColorShaderShader = /* wgsl */ `

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

struct Props {
  color: vec4f,
};

@group(0) @binding(0) var<uniform> props: Props;

@vertex
fn vs(
  @builtin(instance_index) instanceIdx : u32,
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput {
  var pos = array<vec2f, 3>(
    vec2f(-1.0,  3.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, -1.0),
  );

  var uv = array<vec2f, 3>(
    vec2f(0.0, -1.0),
    vec2f(2.0, 1.0),
    vec2f(0.0, 1.0)
  );

  var output: VertexOutput;
  output.position = vec4f(pos[VertexIndex], 0.0, 1.0);
  output.uv = uv[VertexIndex];
  return output;
}

@fragment
fn fs(in: VertexOutput) -> @location(0) vec4f {
  return props.color;
}`;

export interface FillProps {
  color: Color;
}

const key = "ColorShader";

export class ColorShader implements Shader {
  public pipeline: GPURenderPipeline;
  private result: GPUTexture | null = null;
  private uniforms: GPUBuffer | null = null;

  constructor(private device: GPUDevice, color: Color) {
    const resources = GPUResources.getInstance(device);
    if (!resources.modules.has(key)) {
      resources.modules.set(
        key,
        device.createShaderModule({ code: ColorShaderShader })
      );
    }
    const mod = resources.modules.get(key)!;
    if (!resources.pipelines.has(key)) {
      const format = navigator.gpu.getPreferredCanvasFormat();
      const pipeline = device.createRenderPipeline({
        layout: "auto",
        label: "Fill",
        vertex: {
          module: mod,
        },
        fragment: {
          module: mod,
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
      resources.pipelines.set(key, pipeline);
    }
    const pipeline = resources.pipelines.get(key)!;
    const layout = pipeline.getBindGroupLayout(0);
    layout.label = "Circle Bind Group Layout";
    this.pipeline = pipeline;
    this.uniforms = device.createBuffer({
      size: color.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.uniforms, 0, color);
  }

  apply(commandEncoder: GPUCommandEncoder, input: GPUTexture): void {
    const { device } = this;
    const bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.uniforms!,
          },
        },
      ],
    });
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: input.createView(),
          clearValue: [0, 0, 0, 0], // Clear to transparent
          loadOp: "clear",
          storeOp: "store",
        } as const,
      ],
    });
    renderPass.setPipeline(this.pipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.draw(3);
    renderPass.end();
    this.result = input;
  }

  getResult(): GPUTexture {
    if (!this.result) {
      throw new Error("No image filter result available");
    }
    return this.result;
  }
}
