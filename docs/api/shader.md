# Shader

Here are the list of supported `Shader` APIs.
Please file an issue if you would like to see support for some of these unsupported methods.

Currently gradient methods don't have support for the following parameters:
* Tile mode
* Local matrix
* Flags
* Color space

| Method                         | Support | Comments |
|--------------------------------|:-------:|----------|
| MakeBlend                      |   ✅    |          |
| MakeColor                      |   ✅    |          |
| MakeLinearGradient             |   ✅    |          |
| MakeRadialGradient             |   ✅    |          |
| MakeSweepGradient              |   ✅    | End angle parameter not supported. |
| MakeTwoPointConicalGradient    |   ✅    |          |
| MakeTurbulence                 |   ❌    |          |
| MakeFractalNoise               |   ❌    |          |