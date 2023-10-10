# Path

Here are the list of supported `Path` methods. 
Please file an issue if you would like to see support for some of these unsupported methods.

## Factories

| Method                               | Support | Comments |
|--------------------------------------|:------:|-----------|
| MakeFromCmds                         |   ✅   |           |
| MakeFromSVGString                    |   ✅   |           |
| CanInterpolate                       |   ✅   |           |
| MakeFromPathInterpolation            |   ✅   |           |
| MakeFromOp                           |   ❌   |           |
| MakeFromVerbsPointsWeights           |   ❌   |           |


## Methods

| Method                               | Support | Comments |
|--------------------------------------|:-------:|----------|
| swap                                 |   ✅   |          |
| getPath                              |   ✅   |          |
| addArc                               |   ✅   |          |
| addCircle                            |   ✅   |          |
| addOval                              |   ✅   |          |
| addPath                              |   ✅   |          |
| addPoly                              |   ✅   |          |
| addRect                              |   ✅   |          |
| addRRect                             |   ✅   |          |
| addVerbsPointsWeights                |   ❌   |          |
| arc                                  |   ❌   |          |
| arcToOval                            |   ❌   |          |
| arcToRotated                         |   ❌   |          |
| arcToTangent                         |   ❌   |          |
| close                                |   ✅   |          |
| computeTightBounds                   |   ✅   |          |
| conicTo                              |   ✅   |          |
| contains                             |   ✅   |          |
| copy                                 |   ✅   |          |
| countPoints                          |   ✅   |          |
| cubicTo                              |   ✅   |          |
| dash                                 |   ❌   |          |
| equals                               |   ❌   |          |
| getBounds                            |   ✅   |          |
| getNativeFillType                    |   ✅   |          |
| getFillType                          |   ✅   |          |
| getPoint                             |   ✅   |          |
| isEmpty                              |   ❌   |          |
| isVolatile                           |   ❌   |          |
| lineTo                               |   ✅   |          |
| makeAsWinding                        |   ❌   |          |
| moveTo                               |   ✅   |          |
| offset                               |   ✅   |          |
| op                                   |   ❌   |          |
| quadTo                               |   ✅   |          |
| rArcTo                               |   ❌   |          |
| rConicTo                             |   ❌   |          |
| rCubicTo                             |   ✅   |          |
| reset                                |   ✅   |          |
| rewind                               |   ✅   |          |
| rLineTo                              |   ✅   |          |
| rMoveTo                              |   ✅   |          |
| rQuadTo                              |   ✅   |          |
| setFillType                          |   ✅   |          |
| setIsVolatile                        |   ✅   |          |
| simplify                             |   ❌   |          |
| stroke                               |   ❌   |          |
| toCmds                               |   ✅   |          |
| toSVGString                          |   ✅   |          |
| transform                            |   ✅   |          |
| trim                                 |   ✅   |          |
| getPath2D                            |   ✅   |          |
