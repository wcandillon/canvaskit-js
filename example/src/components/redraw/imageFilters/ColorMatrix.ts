import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";

import { GPUResources } from "../drawings/Drawable";

import type { ImageFilter } from "./ImageFilter";

export interface ColorMatrixImageFilterProps {
  matrix: number[];
}

export const ColorMatrixShader = /* wgsl */ `

struct Props {
  matrix: array<vec4<f32>, 5>,
};

fn applyColorTransform(color: vec4<f32>, colorMatrix: array<vec4<f32>, 5>) -> vec4<f32> {
    return vec4<f32>(
        dot(colorMatrix[0], color) + colorMatrix[4].x,
        dot(colorMatrix[1], color) + colorMatrix[4].y,
        dot(colorMatrix[2], color) + colorMatrix[4].z,
        dot(colorMatrix[3], color) + colorMatrix[4].w
    );
}
  
@group(0) @binding(0) var<uniform> props: Props;
@group(0) @binding(1) var input: texture_2d<f32>;
@group(0) @binding(2) var texSampler: sampler;

struct VertexOutput {
  @builtin(position) position : vec4f,
  @location(0) fragUV : vec2f,
  @location(1) color : vec4f,
}

@vertex
fn vert_main(@builtin(vertex_index) VertexIndex : u32) -> VertexOutput {
  const pos = array(
    vec2( 1.0,  1.0),
    vec2( 1.0, -1.0),
    vec2(-1.0, -1.0),
    vec2( 1.0,  1.0),
    vec2(-1.0, -1.0),
    vec2(-1.0,  1.0),
  );

  const uv = array(
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(0.0, 1.0),
    vec2(0.0, 0.0),
  );

  var output : VertexOutput;
  output.position = vec4(pos[VertexIndex], 0.0, 1.0);
  output.fragUV = uv[VertexIndex];
  return output;
}

@fragment
fn frag_main(@location(0) fragUV : vec2f) -> @location(0) vec4f {
  let color = textureSample(input, texSampler, fragUV);
  return applyColorTransform(color, props.matrix);
}
`;

const key = "ColorMatrixImageFilter";
const defs = makeShaderDataDefinitions(ColorMatrixShader);
const propsView = makeStructuredView(defs.uniforms.props);

export class ColorMatrixImageFilter implements ImageFilter {
  private result: GPUTexture | null = null;
  private pipeline: GPURenderPipeline;

  constructor(
    private device: GPUDevice,
    private props: ColorMatrixImageFilterProps
  ) {
    const resources = GPUResources.getInstance(device);
    if (!resources.pipelines.has(key)) {
      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: {
          module: device.createShaderModule({
            code: ColorMatrixShader,
          }),
        },
        fragment: {
          module: device.createShaderModule({
            code: ColorMatrixShader,
          }),
          targets: [
            {
              format: navigator.gpu.getPreferredCanvasFormat(),
            },
          ],
        },
      });
      resources.pipelines.set(key, pipeline);
    }
    this.pipeline = resources.pipelines.get(key)!;
    propsView.set(this.props);
    // create the correct sized buffer
  }

  apply(
    commandEncoder: GPUCommandEncoder,
    input: GPUTexture,
    textureA: GPUTexture,
    _textureB: GPUTexture
  ): void {
    const { device } = this;
    const uniforms = device.createBuffer({
      size: propsView.arrayBuffer.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(uniforms, 0, propsView.arrayBuffer);
    const sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    });
    const bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniforms,
          },
        },
        {
          binding: 1,
          resource: input.createView(),
        },
        {
          binding: 2,
          resource: sampler,
        },
      ],
    });
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureA.createView(),
          clearValue: [0, 0, 0, 0], // Clear to transparent
          loadOp: "clear",
          storeOp: "store",
        } as const,
      ],
    });
    renderPass.setPipeline(this.pipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.draw(6);
    renderPass.end();
    this.result = textureA;
  }

  getResult(): GPUTexture {
    return this.result!;
  }
}
