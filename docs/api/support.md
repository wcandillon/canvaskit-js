# CanvasKit

Here are the list of supported CanvasKit APIs.

Some APIs represent a substancial challenge for them to be implemented while other were simply not needed thus far.
If you need a specific API to be implemented, please let us in the GitHub issues.

Also checkout the [Canvas methods](canvas.md).

| API                                  |       | Comments |
|--------------------------------------|:-----:|----------|
| parseColorString                     |   ✅   |          |
| computeTonalColors                   |   ❌  |          |
| getShadowLocalBounds                 |   ❌   |          |
| Malloc                               |   ✅   |          |
| MallocGlyphIDs                       |   ✅   |          |
| Free                                 |   ✅   | Noop     |
| MakeCanvasSurface                    |   ✅   |          |
| MakeRasterDirectSurface              |   ❌   |          |
| MakeSWCanvasSurface                  |   ✅   | Backed by canvas 2d         |
| MakeWebGLCanvasSurface               |   ✅   | Backed by canvas 2d         |
| MakeSurface                          |   ✅   | Backed by canvas 2d         |
| GetWebGLContext                      |   ✅   | Backed by canvas 2d         |
| MakeGrContext                        |   ✅   | Backed by canvas 2d          |
| MakeWebGLContext                     |   ✅   | Backed by canvas 2d         |
| MakeRenderTarget                     |   ✅   |          |
| deleteContext                        |   ✅   |          |
| MakeCanvas                           |   ✅   |          |
| MakeImage                            |   ✅   |          |
| [MakeImageFromEncoded](image.md)     |   🟠   | Image decoding is asynchronous         |
| MakeImageFromCanvasImageSource       |   ✅   |          |
| MakePicture                          |   ❌   |          |
| MakeVertices                         |   ❌   |          |
| MakeAnimation                        |   ❌   |          |
| MakeManagedAnimation                 |   ❌   |          |
| ParagraphStyle                       |   ✅   |          |
| ContourMeasureIter                   |   ✅   |          |
| [Font](font.md)                      |   🟠   |          |
| Paint                                |   ✅   | Dithering is currently not supported. |
| [Path](path.md)                      |   🟠   |          |
| PictureRecorder                      |   🟠   | Only supports `drawPicture()` and debugging purposes. |
| TextStyle                            |   ✅   |          |
| ParagraphBuilder                     |   ❌   |          |
| ColorFilter                          |   ❌   |          |
| FontCollection                       |   ✅   |          |
| FontMgr                              |   ✅   |          |
| [ImageFilter](image-filter.md)       |   🟠   |          |
| MaskFilter                           |   ✅   |          |
| [RuntimeEffect](runtime-effect.md)   |   🟠   |          |
| [Shader](shader.md)                  |   🟠   |          |
| Typeface                             |   ✅   |          |
| TypefaceFontProvider                 |   ✅   |          |
| PathEffect                           |   ❌   |          |
| ImageData                            |   ✅   |          |
| ColorMatrix                          |   ❌   |          |
| TextBlob                             |   ❌   |          |
| Color                                |   ✅   |          |
| Color4f                              |   ✅   |          |
| ColorAsInt                           |   ✅   |          |
| getColorComponents                   |   ✅   |          |
| multiplyByAlpha                      |   ✅   |          |
| LTRBRect                             |   ✅   |          |
| XYWHRect                             |   ✅   |          |
| LTRBiRect                            |   ✅   |          |
| XYWHiRect                            |   ✅   |          |
| RRectXY                              |   ✅   |          |
| MakeOnScreenGLSurface                |   ❌   |          |
| MakeGPUDeviceContext                 |   ❌   |          |
| MakeGPUTextureSurface                |   ❌   |          |
| MakeGPUCanvasContext                 |   ❌   |          |
| MakeGPUCanvasSurface                 |   ❌   |          |
| MakeLazyImageFromTextureSource       |   ❌   |          |
| getDecodeCacheLimitBytes             |   ❌   |          |
| getDecodeCacheUsedBytes              |   ❌   |          |
| setDecodeCacheLimitBytes             |   ❌   |          |
| MakeAnimatedImageFromEncoded         |   ❌   |          |
