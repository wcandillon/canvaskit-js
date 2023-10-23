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
    checkImage(image, "snapshots/c2d/shader.png");
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

uniform vec2 u_resolution;

varying vec2 v_texCoord;

void main() {
  gl_FragColor = v_texCoord.x > 64. ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 1.0, 1.0);
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
    checkImage(image, "snapshots/c2d/shader2.png");
  });
  it("should draw a simple shader (3)", async () => {
    const image = await remoteSurface.draw(
      ({
        canvas,
        width,
        height,
        center,
        c2d: { Path, Paint, GLSLShader, makeShader },
      }) => {
        const glsl = `precision mediump float;

        uniform vec2 u_resolution;
        
        varying vec2 v_texCoord;
        
        void main() {
          gl_FragColor = v_texCoord.x > 128. ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 1.0, 1.0);
        }`;
        const ctx = makeShader(glsl)!;
        const path = new Path();
        const size = 100;
        const pad = (width - size) / 2;
        path.moveTo(new DOMPoint(pad, pad));
        path.addLinear(new DOMPoint(width - pad, pad));
        path.addLinear(new DOMPoint(width - pad, height - pad));
        path.addLinear(new DOMPoint(pad, height - pad));
        path.close();
        const paint = new Paint();
        const shader = new GLSLShader(ctx, {}, []);
        paint.setShader(shader);
        paint.setColor("cyan");
        canvas.save();
        const matrix = new DOMMatrix();
        matrix.m34 = -1 / (4 * width);
        matrix
          .translateSelf(center.x, center.y)
          .rotateAxisAngleSelf(1, 0, 0, 60)
          .translateSelf(-center.x, -center.y);
        canvas.concat(matrix);
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/shader3.png", { overwrite: true });
  });
});
