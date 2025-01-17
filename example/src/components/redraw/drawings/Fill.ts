import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";

import type { Color } from "../Data";
import type { BlendMode } from "../Paint";

import { makeDrawable } from "./Drawable";

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

export const makeFill = (
  device: GPUDevice,
  blendMode: BlendMode,
  props: FillProps
) => {
  return makeDrawable(
    device,
    "fill",
    FillShader,
    blendMode,
    propsView,
    props,
    6
  );
};
