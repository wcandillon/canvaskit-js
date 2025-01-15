export const CircleShader = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) originalPos: vec2f,
};

struct Info {
  resolution: vec2f,
  center: vec2f,
  radius: f32,
  matrix: mat4x4f,
};

@group(0) @binding(0) var<uniform> info: Info;

@vertex
fn vs(
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput {
  var pos = array<vec2f, 6>(
    vec2(-0.5, 0.5),  // Top-left
    vec2(0.5, 0.5),   // Top-right
    vec2(-0.5, -0.5), // Bottom-left
    
    vec2(-0.5, -0.5), // Bottom-left
    vec2(0.5, 0.5),   // Top-right
    vec2(0.5, -0.5)   // Bottom-right
  );

  let vertexPos = pos[VertexIndex];
  
  // Apply transformation matrix
  let transformedPos = info.matrix * vec4f(vertexPos, 0.0, 1.0);

  var output: VertexOutput;
  output.position = info.matrix * vec4f(vertexPos, 0.0, 1.0);
  output.originalPos = transformedPos.xy;
  return output;
}

@fragment
fn fs(in: VertexOutput) -> @location(0) vec4f {
  let dist = length(in.originalPos);
  let alpha = 1.0 - smoothstep(0.9, 1.0, dist);
  return vec4f(1.0, 0.0, 0.0, 1.0);
}`;
