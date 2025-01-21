export const FillTexture = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@group(0) @binding(0) var aSampler : sampler;
@group(0) @binding(1) var aTexture : texture_2d<f32>;

@fragment
fn frag_main(in : VertexOutput) -> @location(0) vec4f {
  return textureSample(aTexture, aSampler, in.uv);
}
`;

export const FillColor = /* wgsl */ `
struct Props {
  color: vec4<f32>,
};

@binding(0) @group(0) var<uniform> props : Props;

@fragment
fn main() -> @location(0) vec4f {
  return props.color;
}
`;

export const FillVertex = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vs(
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
`;

export const FillShader = /* wgsl */ `
struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f,
    @location(1) uv: vec2f,
    @location(2) @interpolate(flat) useColor: u32,
};

struct Props {
 useColor: u32,
 style: u32,
 color: vec4f,
 strokeWidth: f32,
 matrix: mat4x4<f32>,
 resolution: vec2<f32>,
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

@group(1) @binding(0) var mySampler : sampler;
@group(1) @binding(1) var myTexture : texture_2d<f32>;

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
