import { checkImage, remoteSurface } from "./setup";

describe("Shaders", () => {
  it("should draw a simple shader (1)", async () => {
    const image = await remoteSurface.draw(
      ({
        canvas,
        width,
        height,
        c2d: { Path, Paint, ShaderContext, Shader },
      }) => {
        const glsl = `void mainImage(out vec4 fragColor, in vec2 fragCoord){
          fragColor = fragCoord.x > 128. ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 1.0, 1.0);
        }`;
        const ctx = new ShaderContext(glsl)!;
        const shader = new Shader(ctx, {}, []);
        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.lineTo(new DOMPoint(width, 0));
        path.lineTo(new DOMPoint(width, height));
        path.lineTo(new DOMPoint(0, height));
        path.close();
        const paint = new Paint();
        paint.setShader(shader);
        canvas.save();
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/shader.png");
  });
  it("should draw a simple shader (2)", async () => {
    const image = await remoteSurface.draw(
      ({
        canvas,
        width,
        height,
        c2d: { Path, Paint, ShaderContext, Shader },
      }) => {
        const glsl = `void mainImage(out vec4 fragColor, in vec2 fragCoord){
  fragColor = fragCoord.x > 64. && fragCoord.y > 64. ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 1.0, 1.0);
}`;
        const ctx = new ShaderContext(glsl)!;
        const shader = new Shader(ctx, {}, []);
        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.lineTo(new DOMPoint(width / 2, 0));
        path.lineTo(new DOMPoint(width / 2, height / 2));
        path.lineTo(new DOMPoint(0, height / 2));
        path.close();
        const paint = new Paint();
        paint.setShader(shader);
        canvas.save();
        canvas.concat(new DOMMatrix().scale(2, 2));
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/shader2.png");
  });
  it("should draw a simple shader (3)", async () => {
    const image = await remoteSurface.draw(
      ({
        canvas,
        width,
        height,
        center,
        c2d: { Path, Paint, ShaderContext, Shader },
      }) => {
        const glsl = `void mainImage(out vec4 fragColor, in vec2 fragCoord){
          fragColor = fragCoord.x > 128. ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 1.0, 1.0);
        }`;
        const ctx = new ShaderContext(glsl)!;
        const path = new Path();
        const pad = 0;
        path.moveTo(new DOMPoint(pad, pad));
        path.lineTo(new DOMPoint(width - pad, pad));
        path.lineTo(new DOMPoint(width - pad, height - pad));
        path.lineTo(new DOMPoint(pad, height - pad));
        path.close();
        const paint = new Paint();
        const shader = new Shader(ctx, {}, []);
        paint.setShader(shader);
        paint.setColor("cyan");
        canvas.save();
        const matrix = new DOMMatrix();
        matrix.m34 = -1 / 600;
        matrix
          .translateSelf(center.x, center.y)
          .rotateAxisAngleSelf(1, 0, 0, 60)
          .translateSelf(-center.x, -center.y);
        canvas.concat(matrix);
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/shader3.png");
  });
  it("should draw a simple shader (4)", async () => {
    const image = await remoteSurface.draw(
      ({
        canvas,
        width,
        height,
        c2d: { Path, Paint, ShaderContext, Shader },
      }) => {
        const glsl = `void mainImage(out vec4 fragColor, in vec2 fragCoord){
  fragColor = fragCoord.x > 128. && fragCoord.y > 128. ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 1.0, 1.0);
}`;
        const ctx = new ShaderContext(glsl)!;
        const shader = new Shader(ctx, {}, []);
        const path = new Path();
        path.moveTo(new DOMPoint(width / 2, height / 2));
        path.lineTo(new DOMPoint(width, height / 2));
        path.lineTo(new DOMPoint(width, height));
        path.lineTo(new DOMPoint(width / 2, height));
        path.close();
        const paint = new Paint();
        paint.setShader(shader);
        canvas.save();
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/shader4.png");
  });
  it("should draw a simple shader (5)", async () => {
    // TODO: simplify shader API
    const image = await remoteSurface.draw(
      ({
        canvas,
        width,
        height,
        c2d: { Path, Paint, ShaderContext, Shader },
      }) => {
        const glsl = `void mainImage(out vec4 fragColor, in vec2 fragCoord){
  fragColor = fragCoord.x > 0. ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 1.0, 1.0);
}`;
        const ctx = new ShaderContext(glsl)!;
        const shader = new Shader(ctx, {}, []);
        const path = new Path();
        path.moveTo(new DOMPoint(width / 2, height / 2));
        path.lineTo(new DOMPoint(width, height / 2));
        path.lineTo(new DOMPoint(width, height));
        path.lineTo(new DOMPoint(width / 2, height));
        path.close();
        const paint = new Paint();
        paint.setShader(shader);
        canvas.save();
        canvas.concat(new DOMMatrix().translate(-128, 0));
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/shader5.png");
  });
});
