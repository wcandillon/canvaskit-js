import { makeShaderDataDefinitions } from "webgpu-utils";

import type { Matrix, Point } from "../Data";
import type { Paint } from "../Paint/Paint";

import { makeDrawable } from "./Drawable";

const CircleShader = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) localPos: vec2f,
  @location(1) color: vec4f,
  @location(2) radius: f32,
};

struct Props {
  resolution: vec2f,
  center: vec2f,
  radius: f32,
  matrix: mat4x4f,
  color: vec4f,
};

@group(0) @binding(0) var<storage> instancesProps: array<Props>;

@vertex
fn vs(
  @builtin(instance_index) instanceIdx : u32,
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput {
  let props = instancesProps[instanceIdx];
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
  output.color = props.color;
  output.radius = props.radius;
  return output;
}

struct FragOut {
  @location(0) color : vec4f,
};

@fragment
fn fs(in: VertexOutput) -> FragOut {
  var out: FragOut;
  let dist = length(in.localPos);
  if (dist <= in.radius) {
    out.color = in.color;
  } else {
    discard;
    //out.color = vec4(0.0, 0.0, 0.0, 0.0);
  }
  return out;
}`;

export interface CircleProps {
  resolution: Point;
  center: Point;
  radius: number;
  matrix: Matrix;
  color: Float32Array;
}

const defs = makeShaderDataDefinitions(CircleShader);
export const CirclePropsDefinition = defs.storages.instancesProps;

export const makeCircle = (device: GPUDevice, paint: Paint) => {
  return makeDrawable(device, "circle", CircleShader, paint, 6);
};
