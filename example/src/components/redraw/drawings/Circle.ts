export const CircleShader = /* wgsl */ `

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) originalPos: vec2f, // Pass through original position for fragment shader
};

struct Info {
  center: vec2f,
  radius: f32,
  matrix: mat4x4f,
};

@group(0) @binding(0) var<uniform> info: Info;

@vertex
fn vs(
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput {
  // Define the quad as two triangles using 6 vertices
  var pos = array<vec2f, 6>(
    // First triangle (top-left, bottom-left, bottom-right)
    vec2(-1.0, 1.0),
    vec2(1.0, 1.0),
    vec2(-1.0, -1.0),

    // Second triangle (top-left, bottom-right, top-right)
    vec2(-1.0, -1.0),
    vec2(1.0, 1.0),
    vec2(1.0, -1.0)
  );

  let vertexPos = pos[VertexIndex];

  // Apply transformation matrix to vertex position
  let transformedPos = info.matrix * vec4f(vertexPos, 0.0, 1.0);

  var output: VertexOutput;
  output.position = transformedPos;
  output.originalPos = vertexPos; // Pass original position to fragment shader
  return output;
}


@fragment
fn fs(in: VertexOutput) -> @location(0) vec4f {
  // Calculate distance from specified center using original position
  // Note: We use originalPos since it's in the same space as our center uniform
  let dist = length(in.position.xy - info.center);

  // Check if point is inside circle
  if (dist <= info.radius) {
      return vec4f(1.0, 0.0, 0.0, 1.0); // Red inside circle
  } else {
      return vec4f(0.0, 0.0, 0.0, 0.0); // Transparent outside circle
  }
}`;
