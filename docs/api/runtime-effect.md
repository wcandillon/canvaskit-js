# Runtime Effect

Runtime effects in CanvasKitJS are written using the GLSL.
For instance, consider the following Skia code:

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
uniform sampler2D child;
uniform vec2 resolution;
uniform float r;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 xy = fragCoord.xy;
  xy.x += sin(xy.y / r) * 4.0;
  xy /= resolution;
  fragColor = texture2D(child, xy).rbga;
}
```

In GLSL, `texture2D` uses normalized coordinates that range from 0 to 1, whereas `image.eval` doesn't. This necessitates introducing a new uniform to specify the image size. 
We use the same `mainImage` function signature as [ShaderToy](https://www.shadertoy.com/) that can allow to easily copy/paste from ShaderToy to CanvasKitJS.