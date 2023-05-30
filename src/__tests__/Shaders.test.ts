import { checkImage, skia } from "./setup";

describe("Shaders", () => {
  it("should draw a simple color", async () => {
    const image = await skia.eval(({ CanvasKit, canvas }) => {
      const color = `
void main() {
  gl_FragColor = vec4(0.3, 0.6, 0.9, 1.0);
}`;
      const rt = CanvasKit.RuntimeEffect.Make(color)!;
      const paint = new CanvasKit.Paint();
      paint.setShader(rt.makeShader([]));
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/shaders/solid.png");
  });
  it("should draw a simple shader with a uniform", async () => {
    const image = await skia.eval(({ CanvasKit, canvas }) => {
      const color = `
precision mediump float;

uniform vec3 color;

void main() {
    gl_FragColor = vec4(color, 1.0);
}`;
      const rt = CanvasKit.RuntimeEffect.Make(color)!;
      const paint = new CanvasKit.Paint();
      paint.setShader(rt.makeShader([0.3, 0.6, 0.9]));
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/shaders/solid2.png");
  });
  it("should draw a spiral", async () => {
    const image = await skia.eval(({ CanvasKit, canvas, center }) => {
      const spiral = `
precision mediump float;

uniform float scale;
uniform vec2 center;
uniform vec4 c1;
uniform vec4 c2;
void main() {
    vec2 pp = gl_FragCoord.xy - center;
    float radius = sqrt(dot(pp, pp));
    radius = sqrt(radius);
    float angle = atan(pp.y, pp.x);
    float t = (angle + 3.1415926/2.0) / 3.1415926;
    t += radius * scale;
    t = fract(t);
    gl_FragColor = mix(c1, c2, t);
}`;
      const rt = CanvasKit.RuntimeEffect.Make(spiral)!;
      const paint = new CanvasKit.Paint();
      paint.setShader(
        rt.makeShader([
          0.6,
          center.x,
          center.y,
          ...CanvasKit.RED,
          ...CanvasKit.GREEN,
        ])
      );
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/shaders/spiral.png");
  });
  it("should support arrays as uniform", async () => {
    const image = await skia.eval(({ CanvasKit, canvas, center }) => {
      const spiral = `
precision mediump float;

uniform float scale;
uniform vec2 center;
uniform vec4 colors[2];
void main() {
    vec2 pp = gl_FragCoord.xy - center;
    float radius = sqrt(dot(pp, pp));
    radius = sqrt(radius);
    float angle = atan(pp.y, pp.x);
    float t = (angle + 3.1415926/2.0) / 3.1415926;
    t += radius * scale;
    t = fract(t);
    gl_FragColor = mix(colors[0], colors[1], t);
}`;
      const rt = CanvasKit.RuntimeEffect.Make(spiral)!;
      const paint = new CanvasKit.Paint();
      paint.setShader(
        rt.makeShader([
          0.6,
          center.x,
          center.y,
          ...CanvasKit.RED,
          ...CanvasKit.GREEN,
        ])
      );
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/shaders/spiral.png");
  });
  it("should support any sizes", async () => {
    const image = await skia.eval(
      ({ CanvasKit, canvas, center }) => {
        const spiral = `
precision mediump float;

uniform float scale;
uniform vec2 center;
uniform vec4 colors[2];
void main() {
    vec2 pp = gl_FragCoord.xy - center;
    float radius = sqrt(dot(pp, pp));
    radius = sqrt(radius);
    float angle = atan(pp.y, pp.x);
    float t = (angle + 3.1415926/2.0) / 3.1415926;
    t += radius * scale;
    t = fract(t);
    gl_FragColor = mix(colors[0], colors[1], t);
}`;
        const rt = CanvasKit.RuntimeEffect.Make(spiral)!;
        const paint = new CanvasKit.Paint();
        paint.setShader(
          rt.makeShader([
            0.6,
            center.x,
            center.y,
            ...CanvasKit.RED,
            ...CanvasKit.GREEN,
          ])
        );
        canvas.drawPaint(paint);
      },
      1024,
      1024
    );
    checkImage(image, "snapshots/shaders/spiral-large.png");
  });
  it("should support shaders as uniform", async () => {
    const image = await skia.eval(({ CanvasKit, canvas, width }) => {
      const child1 = CanvasKit.Shader.MakeColor(
        [1, 0, 0, 1],
        CanvasKit.ColorSpace.SRGB
      )!;
      const child2 = CanvasKit.Shader.MakeColor(
        [0, 0, 1, 1],
        CanvasKit.ColorSpace.SRGB
      )!;
      const shader = `precision mediump float;

uniform sampler2D child1;
uniform sampler2D child2;

void main() {
  vec4 c1 = texture2D(child1, vec2(0, 0));
  vec4 c2 = texture2D(child2, vec2(0, 0));
  gl_FragColor = mix(c1, c2, 0.5);
}`;
      const rt = CanvasKit.RuntimeEffect.Make(shader)!;
      const paint = new CanvasKit.Paint();
      paint.setShader(rt.makeShaderWithChildren([], [child1, child2]));
      canvas.drawCircle(width / 2, width / 2, width / 2, paint);
    });
    checkImage(image, "snapshots/shaders/children.png");
  });
});
