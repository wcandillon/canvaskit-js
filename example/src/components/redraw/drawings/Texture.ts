import type { BlendMode } from "../Paint/BlendMode";
import { GPUBlendModes } from "../Paint/BlendMode";

import { GPUResources } from "./Drawable";

export const TextureShader = /* wgsl */ `
@group(0) @binding(0) var mySampler : sampler;
@group(0) @binding(1) var myTexture : texture_2d<f32>;

struct VertexOutput {
  @builtin(position) Position : vec4f,
  @location(0) fragUV : vec2f,
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
  output.Position = vec4(pos[VertexIndex], 0.0, 1.0);
  output.fragUV = uv[VertexIndex];
  return output;
}

@fragment
fn frag_main(@location(0) fragUV : vec2f) -> @location(0) vec4f {
  return textureSample(myTexture, mySampler, fragUV);
}
`;

const key = "FullScreenTexture";

export const makeTexturePipeline = (
  device: GPUDevice,
  blendMode: BlendMode
) => {
  const resources = GPUResources.getInstance(device);
  if (!resources.pipelines.has(key)) {
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: device.createShaderModule({
          code: TextureShader,
        }),
      },
      fragment: {
        module: device.createShaderModule({
          code: TextureShader,
        }),
        targets: [
          {
            format: presentationFormat,
            blend: GPUBlendModes[blendMode],
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
    resources.pipelines.set(key, pipeline);
  }
  return resources.pipelines.get(key)!;
};
