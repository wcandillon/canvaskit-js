import { Parser } from "./parse";

export function parseLtagTable(data: DataView, start: number) {
  const p = new Parser(data, start);
  const tableVersion = p.parseULong();
  if (tableVersion !== 1) {
    throw Error("Unsupported ltag table version");
  }
  p.skip("uLong", 1);
  const numTags = p.parseULong();

  const tags = [];
  for (let i = 0; i < numTags; i++) {
    let tag = "";
    const offset = start + p.parseUShort();
    const length = p.parseUShort();
    for (let j = offset; j < offset + length; ++j) {
      tag += String.fromCharCode(data.getInt8(j));
    }

    tags.push(tag);
  }

  return tags;
}
