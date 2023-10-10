# CanvasKit

Here are the list of supported CanvasKit APIs.
Please file on issue if you would like to see support for some of these unsupported APIs.

| Method Name                          |       | Comments |
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
| MakeImageFromEncoded                 |   ❌   | Synchronous image decoding is not supported. Use MakeImageFromURIAsync and MakeImageFromEncodedAsync instead.     |
| MakeImageFromCanvasImageSource       |   ✅   |          |
| MakePicture                          |   ❌   |          |
| MakeVertices                         |   ❌   |          |
| MakeAnimation                        |   ❌   |          |
| MakeManagedAnimation                 |   ❌   |          |
| ParagraphStyle                       |   ✅   |          |
| ContourMeasureIter                   |   ✅   |          |
| Font                                 |   🟠   |          |
| Paint                                |   ✅   |          |
| Path                                 |   🟠   |          |
| PictureRecorder                      |   🟠   |          |
| TextStyle                            |   ✅   |          |
| ParagraphBuilder                     |   ❌   |          |
| ColorFilter                          |   ❌   |          |
| FontCollection                       |   ✅   |          |
| FontMgr                              |   ✅   |          |
| ImageFilter                          |   🟠   |          |
| MaskFilter                           |   ✅   |          |
| RuntimeEffect                        |   ✅   |          |
| Shader                               |   🟠   |          |
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