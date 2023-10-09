import type { Path } from "../Path";

export interface PathEffect {
  filterPath(path: Path): Path;
}
