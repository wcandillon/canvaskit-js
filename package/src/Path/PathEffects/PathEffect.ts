import type { Path } from "../../c2d";

export interface PathEffect {
  filterPath(path: Path): Path;
}
