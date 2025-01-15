export const QuadVertex = /* wgsl */ `
@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
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

  return vec4f(pos[VertexIndex], 0.0, 1.0);
}`;
