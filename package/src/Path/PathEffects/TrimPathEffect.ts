import { Path } from "../Path";
import { PathEffect } from "./PathEffect";

// private readonly _start: number, private readonly _end: number, private readonly _complement: boolean
export class TrimPathEffect implements PathEffect {
    constructor() {}

    filterPath(_path: Path): Path {
        throw new Error("Method not implemented.");
    }
}