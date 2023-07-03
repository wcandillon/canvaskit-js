import { Path } from "../Path";

export interface PathEffect {
    filterPath(path: Path): Path;
}