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
    vec2(-1.0, 1.0),   // Top-left
    vec2(1.0, 1.0),    // Top-right
    vec2(-1.0, -1.0),  // Bottom-left
    
    vec2(-1.0, -1.0),  // Bottom-left
    vec2(1.0, 1.0),    // Top-right
    vec2(1.0, -1.0)    // Bottom-right
  );
  
  let aspectRatio = info.resolution.x / info.resolution.y;
  let vertexPos = pos[VertexIndex] * info.radius;
  
  // Adjust for aspect ratio and convert to normalized device coordinates
  let adjustedPos = vec2f(
    (vertexPos.x + info.center.x - info.radius) / (info.resolution.x * 0.5) * 2.0 - 1.0,
    -((vertexPos.y + info.center.y - info.radius) / (info.resolution.y * 0.5) * 2.0 - 1.0)
  );
  
  var output: VertexOutput;
  output.position = vec4f(adjustedPos, 0.0, 1.0);
  output.originalPos = vertexPos + info.center - vec2f(info.radius, info.radius);
  return output;
}

@fragment
fn fs(in: VertexOutput) -> @location(0) vec4f {
  return vec4f(1.0, 0.0, 0.0, 1.0);
}`;
