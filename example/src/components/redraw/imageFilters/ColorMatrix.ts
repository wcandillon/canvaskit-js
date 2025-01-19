import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";

import { GPUResources } from "../drawings/Drawable";

import type { ImageFilter } from "./ImageFilter";

export interface ColorMatrixImageFilterProps {
  matrix: number[];
}

export const ColorMatrixShader = /* wgsl */ `

struct ColorMatrix {
    r1: f32, r2: f32, r3: f32, r4: f32, r5: f32,
    g1: f32, g2: f32, g3: f32, g4: f32, g5: f32,
    b1: f32, b2: f32, b3: f32, b4: f32, b5: f32,
    a1: f32, a2: f32, a3: f32, a4: f32, a5: f32,
};

struct Props {
  matrix: ColorMatrix,
};

fn applyColorTransform(c: vec4f, cm: ColorMatrix) -> vec4f {
    return vec4f(
        cm.r1*c.r + cm.r2*c.g + cm.r3*c.b + cm.r4*c.a + cm.r5,
        cm.g1*c.r + cm.g2*c.g + cm.g3*c.b + cm.g4*c.a + cm.g5,
        cm.b1*c.r + cm.b2*c.g + cm.b3*c.b + cm.b4*c.a + cm.b5,
        cm.a1*c.r + cm.a2*c.g + cm.a3*c.b + cm.a4*c.a + cm.a5
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
  private uniforms: GPUBuffer;

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
    this.uniforms = device.createBuffer({
      size: propsView.arrayBuffer.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.uniforms, 0, propsView.arrayBuffer);
  }

  apply(
    commandEncoder: GPUCommandEncoder,
    input: GPUTexture,
    textureA: GPUTexture,
    _textureB: GPUTexture
  ): void {
    const { device } = this;
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
            buffer: this.uniforms,
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
