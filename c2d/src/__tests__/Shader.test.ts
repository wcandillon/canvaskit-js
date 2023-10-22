import { checkImage, remoteSurface } from "./setup";

describe("Shaders", () => {
  it("should draw a simple shader (1)", async () => {
    // TODO: simplify shader API
    const image = await remoteSurface.draw(
      ({
        canvas,
        width,
        height,
        c2d: { Path, Paint, makeShader, GLSLShader },
      }) => {
        const glsl = `precision mediump float;

void main() {
  gl_FragColor = gl_FragCoord.x > 128. ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 1.0, 1.0);
}`;
        const ctx = makeShader(glsl)!;
        const shader = new GLSLShader(ctx, {}, []);
        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.addLinear(new DOMPoint(width, 0));
        path.addLinear(new DOMPoint(width, height));
        path.addLinear(new DOMPoint(0, height));
        path.close();
        const paint = new Paint();
        paint.setShader(shader);
        canvas.save();
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/shader.png", { overwrite: true });
  });
  it("should draw a simple shader (2)", async () => {
    // TODO: simplify shader API
    const image = await remoteSurface.draw(
      ({
        canvas,
        width,
        height,
        c2d: { Path, Paint, makeShader, GLSLShader },
      }) => {
        const glsl = `precision mediump float;

void main() {
  gl_FragColor = gl_FragCoord.x > 64. ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 1.0, 1.0);
}`;
        const ctx = makeShader(glsl)!;
        const shader = new GLSLShader(ctx, {}, []);
        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.addLinear(new DOMPoint(width / 2, 0));
        path.addLinear(new DOMPoint(width / 2, height / 2));
        path.addLinear(new DOMPoint(0, height / 2));
        path.close();
        const paint = new Paint();
        paint.setShader(shader);
        canvas.save();
        canvas.concat(new DOMMatrix().scale(2, 2));
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/shader2.png", { overwrite: true });
  });
});
