import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";

import type { Matrix, Point } from "../Data";
import type { Paint } from "../Paint/Paint";

import { makeDrawable } from "./Drawable";

const CircleShader = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) localPos: vec2f,
};

struct Props {
  resolution: vec2f,
  center: vec2f,
  radius: f32,
  matrix: mat4x4f,
  color: vec4f,
};

@group(0) @binding(0) var<uniform> props: Props;

@vertex
fn vs(
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput {
  let c = props.center;
  let r = props.radius;
  let pos = array<vec2f, 6>(
    vec2f(c.x - r, c.y - r),   // Top-left
    vec2f(c.x + r, c.y - r),    // Top-right
    vec2f(c.x - r, c.y + r),  // Bottom-left
    
    vec2f(c.x - r, c.y + r),  // Bottom-left
    vec2f(c.x + r, c.y - r),    // Top-right
    vec2f(c.x + r, c.y + r),  // Bottom-left
  );
  
  let vertexPos = pos[VertexIndex];
  let localPos = vertexPos - c;
  // Multiply by a matrix
  let position = (props.matrix * vec4f(vertexPos, 0, 1)).xy;
  // convert the position from pixels to a 0.0 to 1.0 value
  let zeroToOne = position / props.resolution;
  // convert from 0 <-> 1 to 0 <-> 2
  let zeroToTwo = zeroToOne * 2.0;
  // covert from 0 <-> 2 to -1 <-> +1 (clip space)
  let flippedClipSpace = zeroToTwo - 1.0;
  // flip Y
  let clipSpace = flippedClipSpace * vec2f(1, -1);
  var output: VertexOutput;
  output.position = vec4f(clipSpace, 0.0, 1.0);
  output.localPos = localPos;
  return output;
}

struct FragOut {
  @location(0) color : vec4f,
};

@fragment
fn fs(in: VertexOutput) -> FragOut {
  var out: FragOut;
  let dist = length(in.localPos);
  if (dist <= props.radius) {
    out.color = props.color;
  } else {
    discard;
  }
  return out;
}`;

interface CircleProps {
  resolution: Point;
  center: Point;
  radius: number;
  matrix: Matrix;
  color: Float32Array;
}

const defs = makeShaderDataDefinitions(CircleShader);
const propsView = makeStructuredView(defs.uniforms.props);

export const makeCircle = (
  device: GPUDevice,
  paint: Paint,
  props: CircleProps
) => {
  return makeDrawable(
    device,
    "circle",
    CircleShader,
    paint,
    propsView,
    props,
    6
  );
};
