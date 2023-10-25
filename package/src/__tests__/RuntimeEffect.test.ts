//import type { Rect } from "canvaskit-wasm";

import type { Rect } from "canvaskit-wasm";

import { checkImage, skia } from "./setup";

describe("Runtime Effects", () => {
  it("should draw a simple color", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      const color = `
void mainImage(out vec4 fragColor, in vec2 fragCoord){
  fragColor = vec4(0.3, 0.6, 0.9, 1.0);
}
`;
      const rt = CanvasKit.RuntimeEffect.Make(color)!;
      const paint = new CanvasKit.Paint();
      paint.setShader(rt.makeShader([]));
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/shaders/solid.png");
  });
  it("should draw a simple shader with a uniform", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      const color = `
uniform vec3 color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
  fragColor = vec4(color, 1.0);
}`;
      const rt = CanvasKit.RuntimeEffect.Make(color)!;
      const paint = new CanvasKit.Paint();
      paint.setShader(rt.makeShader([0.3, 0.6, 0.9]));
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/shaders/solid2.png");
  });
  it("should draw a spiral", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, center }) => {
      const spiral = `
  uniform float scale;
  uniform vec2 center;
  uniform vec4 c1;
  uniform vec4 c2;

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 pp = fragCoord.xy - center;
      float radius = sqrt(dot(pp, pp));
      radius = sqrt(radius);
      float angle = atan(pp.y, pp.x);
      float t = (angle + 3.1415926/2.0) / 3.1415926;
      t += radius * scale;
      t = fract(t);
      fragColor = mix(c1, c2, t);
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
    const image = await skia.draw(({ CanvasKit, canvas, center }) => {
      const spiral = `
  uniform float scale;
  uniform vec2 center;
  uniform vec4 colors[2];

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 pp = fragCoord.xy - center;
      float radius = sqrt(dot(pp, pp));
      radius = sqrt(radius);
      float angle = atan(pp.y, pp.x);
      float t = (angle + 3.1415926/2.0) / 3.1415926;
      t += radius * scale;
      t = fract(t);
      fragColor = mix(colors[0], colors[1], t);
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
    const image = await skia.draw(
      ({ CanvasKit, canvas, center }) => {
        const spiral = `
  uniform float scale;
  uniform vec2 center;
  uniform vec4 colors[2];

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 pp = fragCoord.xy - center;
      float radius = sqrt(dot(pp, pp));
      radius = sqrt(radius);
      float angle = atan(pp.y, pp.x);
      float t = (angle + 3.1415926/2.0) / 3.1415926;
      t += radius * scale;
      t = fract(t);
      fragColor = mix(colors[0], colors[1], t);
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
      { width: 1024, height: 1024 }
    );
    checkImage(image, "snapshots/shaders/spiral-large.png");
  });
  it("should support shaders as uniform", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const child1 = CanvasKit.Shader.MakeColor(
        [1, 0, 0, 1],
        CanvasKit.ColorSpace.SRGB
      );
      const child2 = CanvasKit.Shader.MakeColor(
        [0, 0, 1, 1],
        CanvasKit.ColorSpace.SRGB
      );
      const shader = `
  uniform sampler2D child1;
  uniform sampler2D child2;

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec4 c1 = texture2D(child1, vec2(0, 0));
    vec4 c2 = texture2D(child2, vec2(0, 0));
    fragColor = mix(c1, c2, 0.5);
  }`;
      const rt = CanvasKit.RuntimeEffect.Make(shader)!;
      const paint = new CanvasKit.Paint();
      paint.setShader(rt.makeShaderWithChildren([], [child1, child2]));
      canvas.drawCircle(width / 2, width / 2, width / 2, paint);
    });
    checkImage(image, "snapshots/shaders/children.png");
  });

  it("should display an image shader with cover (1)", async () => {
    const image = await skia.draw(
      ({
        canvas,
        CanvasKit,
        width,
        height,
        assets: { zurich },
        lib: { fitRects },
      }) => {
        const shader = `
  uniform sampler2D child;

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy/vec2(256.0, 256.0);
    fragColor = texture2D(child, uv);
  }`;
        const rt = CanvasKit.RuntimeEffect.Make(shader)!;
        const rect = (rct: Float32Array) => ({
          x: rct[0],
          y: rct[1],
          width: rct[2] - rct[0],
          height: rct[3] - rct[1],
        });

        const rect2rect = (_src: Rect, _dst: Rect) => {
          const src = rect(_src);
          const dst = rect(_dst);
          const scaleX = dst.width / src.width;
          const scaleY = dst.height / src.height;
          const translateX = dst.x - src.x * scaleX;
          const translateY = dst.y - src.y * scaleY;
          const m = new DOMMatrix();
          m.translateSelf(translateX, translateY);
          m.scaleSelf(scaleX, scaleY);
          return m;
        };

        const input = CanvasKit.XYWHRect(0, 0, zurich.width(), zurich.height());
        const output = CanvasKit.XYWHRect(0, 0, width, height);
        const { src, dst } = fitRects("cover", input, output);
        const transform = rect2rect(src, dst);
        const imgShader = zurich.makeShaderOptions(
          CanvasKit.TileMode.Clamp,
          CanvasKit.TileMode.Clamp,
          CanvasKit.FilterMode.Linear,
          CanvasKit.MipmapMode.None,
          transform
        );
        const paint = new CanvasKit.Paint();
        paint.setShader(rt.makeShaderWithChildren([], [imgShader]));
        canvas.save();
        canvas.drawPaint(paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/zurich-cover.png");
  });
  // it("should display an image shader with cover (2)", async () => {
  //   const image = await skia.draw(
  //     ({
  //       canvas,
  //       CanvasKit,
  //       width,
  //       height,
  //       assets: { zurich },
  //       lib: { fitRects },
  //     }) => {
  //       const shader = `
  // uniform sampler2D child;

  // void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  //   vec2 uv = fragCoord.xy/vec2(256.0, 256.0);
  //   fragColor = texture2D(child, uv);
  // }`;
  //       const rt = CanvasKit.RuntimeEffect.Make(shader)!;
  //       const rect = (rct: Float32Array) => ({
  //         x: rct[0],
  //         y: rct[1],
  //         width: rct[2] - rct[0],
  //         height: rct[3] - rct[1],
  //       });

  //       const rect2rect = (_src: Rect, _dst: Rect) => {
  //         const src = rect(_src);
  //         const dst = rect(_dst);
  //         const scaleX = dst.width / src.width;
  //         const scaleY = dst.height / src.height;
  //         const translateX = dst.x - src.x * scaleX;
  //         const translateY = dst.y - src.y * scaleY;
  //         const m = new DOMMatrix();
  //         m.translateSelf(translateX, translateY);
  //         m.scaleSelf(scaleX, scaleY);
  //         return m;
  //       };

  //       const input = CanvasKit.XYWHRect(0, 0, zurich.width(), zurich.height());
  //       const output = CanvasKit.XYWHRect(0, 0, width, height);
  //       const { src, dst } = fitRects("cover", input, output);
  //       const transform = rect2rect(src, dst);
  //       const imgShader = zurich.makeShaderOptions(
  //         CanvasKit.TileMode.Clamp,
  //         CanvasKit.TileMode.Clamp,
  //         CanvasKit.FilterMode.Linear,
  //         CanvasKit.MipmapMode.None
  //       );
  //       const paint = new CanvasKit.Paint();
  //       paint.setShader(rt.makeShaderWithChildren([], [imgShader]));
  //       canvas.save();
  //       canvas.concat(transform);
  //       canvas.drawPaint(paint);
  //       canvas.restore();
  //     }
  //   );
  //   checkImage(image, "snapshots/zurich-cover.png");
  // });
  // it("should show a fractal noise", async () => {
  //   const image = await skia.eval(({ CanvasKit, canvas }) => {
  //     const noise = CanvasKit.Shader.MakeFractalNoise(0.05, 0.05, 4, 0, 10, 10);
  //     const paint = new CanvasKit.Paint();
  //     paint.setShader(noise);
  //     canvas.drawPaint(paint);
  //   });
  //   checkImage(image, "snapshots/shaders/fractal-noise.png");
  // });
});
