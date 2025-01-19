import { makeShaderDataDefinitions } from "webgpu-utils";

import type { Color } from "../Data";
import type { Paint } from "../Paint/Paint";

import { makeDrawable } from "./Drawable";

export const FillShader = /* wgsl */ `

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
};

struct Props {
  color: vec4f,
};

@group(0) @binding(0) var<storage> instancesProps: array<Props>;

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
  var output: VertexOutput;
  output.position = vec4f(pos[VertexIndex], 0.0, 1.0);
  output.color = instancesProps[instanceIdx].color;
  return output;
}

struct FragOut {
  // This is the actual color to be written to the color attachment
  @location(0) color : vec4f,
};

@fragment
fn fs(in: VertexOutput) -> FragOut {
  var out: FragOut;
  out.color = in.color;
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
