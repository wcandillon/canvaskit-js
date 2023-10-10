# Runtime Effect

Support for runtime effects is currently in its early stages.

There are two major limitations with runtime effects at present:
* They are written using GLSL syntax.
* They are not aware of the current transformation matrix.

In the short term, we aim to improve the ergonomics of writing these GLSL shaders significantly. Over the long term, we hope to offer tooling that compiles SKSL shaders directly to WebGL.

For instance, consider the following CanvasKit code:

```tsx
const re = CanvasKit.RuntimeEffect.Make(`
uniform shader image;
uniform float r;

half4 main(float2 xy) {   
  xy.x += sin(xy.y / r) * 4;
  return image.eval(xy).rbga;
}
`)!;

const paint = new CanvasKit.Paint();
paint.setShader(
  rt.makeShaderWithChildren([mix(progress.value, 1, 100)], [imageShader])
);
const pd = window.devicePixelRatio;
canvas.scale(pd, pd);
canvas.drawPaint(paint);
canvas.restore();
```

To migrate this shader to `canvaskit-js`, we first need to rewrite it in GLSL:

```glsl
precision mediump float;

uniform sampler2D child;
uniform vec2 resolution;
uniform float r;

void main() {
  vec2 xy = gl_FragCoord.xy;
  xy.x += sin(xy.y / r) * 4.0;
  xy /= resolution;
  gl_FragColor = texture2D(child, vec2(xy.x, 1.0 - xy.y)).rbga;
}
```

In GLSL, `texture2D` uses normalized coordinates that range from 0 to 1, whereas `image.eval` doesn't. This necessitates introducing a new uniform to specify the image size. Additionally, we needed to invert the y-axis with `1.0 - xy.y`. As the shader is not aware of the current transformation matrix, the `resolution` uniform should account for the current transform matrix. In the example above, this means scaling the size according to pixel density.

```tsx
const pd = window.devicePixelRatio;
paint.setShader(
  rt.makeShaderWithChildren([mix(progress.value, 1, 100), width * pd, height * pd], [imageShader])
);
```
