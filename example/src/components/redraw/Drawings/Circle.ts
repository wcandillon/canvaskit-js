export const CircleShader = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) localPos: vec2f,
  @location(1) color: vec4f,
  @location(2) radius: f32,
  @location(3) uv: vec2f,
  @location(4) @interpolate(flat) useColor: u32,
};

struct Props {
  useColor: u32,
  style: u32,
  color: vec4f,
  strokeWidth: f32,
  matrix: mat4x4<f32>,
  resolution: vec2<f32>,
  radius: f32,
  center: vec2f,
};

@group(0) @binding(0) var<storage> instancesProps: array<Props>;

@group(1) @binding(0) var mySampler : sampler;
@group(1) @binding(1) var myTexture : texture_2d<f32>;

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

        // Define UV coordinates for each vertex
  let uvs = array<vec2f, 6>(
    vec2f(0.0, 0.0),  // Top-left
    vec2f(1.0, 0.0),  // Top-right
    vec2f(0.0, 1.0),  // Bottom-left
     
    vec2f(0.0, 1.0),  // Bottom-left
    vec2f(1.0, 0.0),  // Top-right
    vec2f(1.0, 1.0)   // Bottom-right
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
  output.uv = uvs[VertexIndex];
  output.useColor = props.useColor;
  return output;
}

struct FragOut {
  @location(0) color : vec4f,
};

@fragment
fn fs(in: VertexOutput) -> FragOut {
  var out: FragOut;
  let dist = length(in.localPos);
  let sample = textureSample(myTexture, mySampler, in.uv);
  if (dist <= in.radius) {
    if (in.useColor == 1u) {
      out.color = in.color;
    } else {
      out.color = sample;
    }
  } else {
    discard;
    //out.color = vec4(0.0, 0.0, 0.0, 0.0);
  }
  return out;
}
`;
