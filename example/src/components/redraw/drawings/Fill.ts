import { makeShaderDataDefinitions } from "webgpu-utils";

import type { Color } from "../Data";
import type { Paint } from "../Paint/Paint";

import { makeDrawable } from "./Drawable";

const FillShader = /* wgsl */ `

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
  @location(1) uv: vec2f,
  @location(2) @interpolate(flat) useColor: u32,
};

struct Props {
  color: vec4f,
  useColor: u32,
};

@group(0) @binding(0) var<storage> instancesProps: array<Props>;

@group(1) @binding(0) var mySampler : sampler;
@group(1) @binding(1) var myTexture : texture_2d<f32>;

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
  output.color = instancesProps[instanceIdx].color;
  output.uv = uv[VertexIndex];
  output.useColor = instancesProps[instanceIdx].useColor;
  return output;
}

struct FragOut {
  // This is the actual color to be written to the color attachment
  @location(0) color : vec4f,
};

@fragment
fn fs(
  in: VertexOutput,
) -> FragOut {
  var out: FragOut;
  let sample = textureSample(myTexture, mySampler, in.uv);
  if (in.useColor == 1u) {
    out.color = in.color;
  } else {
    out.color = sample;
  }
  return out;
}`;

export interface FillProps {
  color: Color;
}

const defs = makeShaderDataDefinitions(FillShader);
export const FillPropsDefinition = defs.storages.instancesProps;

export const makeFill = (device: GPUDevice, paint: Paint) => {
  return makeDrawable(device, "fill", FillShader, paint, 3);
};
