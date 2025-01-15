export const CircleShader = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) originalPos: vec2f,
};

struct Info {
  resolution: vec2f,
  center: vec2f,
  radius: f32,
  _pad: f32,
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
  
  // Calculate the scale needed for the diagonal to be 2 * radius
  let diagonalScale = (2.0 * info.radius) / sqrt(2.0);
  
  // Scale vertex position to achieve desired radius
  let scaledPos = vertexPos * diagonalScale;
  
  // Convert to clip space coordinates (-1 to 1)
  // We divide by resolution/2 to normalize to clip space
  let clipSpacePos = scaledPos / (info.resolution * 0.5);
  
  // Apply transformation matrix
  let transformedPos = info.matrix * vec4f(clipSpacePos, 0.0, 1.0);

  var output: VertexOutput;
  output.position = transformedPos;
  output.originalPos = vertexPos;
  return output;
}

@fragment
fn fs(in: VertexOutput) -> @location(0) vec4f {
  return vec4f(1.0, 0.0, 0.0, 1.0);
}`;
