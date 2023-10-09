import type {
  PathEffectFactory as CKPathEffectFactory,
  EmbindEnumEntity,
  InputMatrix,
  Path,
  PathEffect,
} from "canvaskit-wasm";
export const PathEffectFactory: CKPathEffectFactory = {
  MakeCorner: function (_radius: number): PathEffect | null {
    throw new Error("Function not implemented.");
  },
  MakeDash: function (
    _intervals: number[],
    _phase?: number | undefined
  ): PathEffect {
    throw new Error("Function not implemented.");
  },
  MakeDiscrete: function (
    _segLength: number,
    _dev: number,
    _seedAssist: number
  ): PathEffect {
    throw new Error("Function not implemented.");
  },
  MakeLine2D: function (
    _width: number,
    _matrix: InputMatrix
  ): PathEffect | null {
    throw new Error("Function not implemented.");
  },
  MakePath1D: function (
    _path: Path,
    _advance: number,
    _phase: number,
    _style: EmbindEnumEntity
  ): PathEffect | null {
    throw new Error("Function not implemented.");
  },
  MakePath2D: function (_matrix: InputMatrix, _path: Path): PathEffect | null {
    throw new Error("Function not implemented.");
  },
};
