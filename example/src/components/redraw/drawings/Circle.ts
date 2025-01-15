export const CircleFragment = /* wgsl */ `

struct Info {
  center: vec2f,
  radius: f32,
  _pad: f32,
};

@group(0) @binding(0) var<uniform> info: Info;

@fragment
fn main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  // Calculate distance from specified center
  let dist = length(position.xy - info.center);
  // Check if point is inside circle
  if (dist <= info.radius) {
    return vec4f(1.0, 0.0, 0.0, 1.0); // Red inside circle
  } else {
    return vec4f(0.0, 0.0, 0.0, 0.0); // Transparent outside circle
  }
}`;
