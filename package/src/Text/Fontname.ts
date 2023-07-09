const readUshort = (view: DataView, p: number) => view.getUint16(p);
const readUint = (view: DataView, p: number) => view.getUint32(p);

const readUnicode = (view: DataView, p: number, l: number): string => {
  let result = "";
  for (let i = 0; i < 2 * l; i += 2) {
    const charCode = view.getUint16(p + i);
    result += String.fromCharCode(charCode);
  }
  return result;
};

const readASCII = (view: DataView, p: number, l: number): string => {
  let result = "";
  for (let i = 0; i < l; i++) {
    const charCode = view.getUint8(p + i);
    result += String.fromCharCode(charCode);
  }
  return result;
};

const names = [
  "copyright",
  "fontFamily",
  "fontSubfamily",
  "ID",
  "fullName",
  "version",
  "postScriptName",
  "trademark",
  "manufacturer",
  "designer",
  "description",
  "urlVendor",
  "urlDesigner",
  "licence",
  "licenceURL",
  "---",
  "typoFamilyName",
  "typoSubfamilyName",
  "compatibleFull",
  "sampleText",
  "postScriptCID",
  "wwsFamilyName",
  "wwsSubfamilyName",
  "lightPalette",
  "darkPalette",
  "preferredFamily",
  "preferredSubfamily",
] as const;

interface TypefaceMetadata {
  typoFamilyName: string;
  typoSubfamilyName: string;
  fontFamily: string;
  fontSubfamily: string;
}

export const getFontMetadata = (data: ArrayBuffer): TypefaceMetadata => {
  const view = new DataView(data);
  const tag = readASCII(view, 0, 4);
  // If the file is a TrueType Collection
  if (tag === "ttcf") {
    let offset = 8;
    const numF = readUint(view, offset);
    offset += 4;
    const fnts = [];
    for (let i = 0; i < numF; i++) {
      const foff = readUint(view, offset);
      offset += 4;
      fnts.push(readFont(view, foff));
    }
    throw new Error("TrueType Collection fonts are not supported yet");
  } else {
    return readFont(view, 0);
  }
};

const readFont = (view: DataView, offset: number): TypefaceMetadata => {
  offset += 4;
  const numTables = readUshort(view, offset);
  offset += 8;

  for (let i = 0; i < numTables; i++) {
    const tag = readASCII(view, offset, 4);
    offset += 8;
    const toffset = readUint(view, offset);
    offset += 8;
    if (tag === "name") {
      return parse(view, toffset);
    }
  }

  throw new Error("Failed to parse file");
};

const parse = (view: DataView, offset = 0): TypefaceMetadata => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: Record<string, any> = {};
  offset += 2;
  const count = readUshort(view, offset);
  offset += 2;
  offset += 2;
  const offset0 = offset;
  for (let i = 0; i < count; i++) {
    const platformID = readUshort(view, offset);
    offset += 2;
    const encodingID = readUshort(view, offset);
    offset += 2;
    const languageID = readUshort(view, offset);
    offset += 2;
    const nameID = readUshort(view, offset);
    offset += 2;
    const slen = readUshort(view, offset);
    offset += 2;
    const noffset = readUshort(view, offset);
    offset += 2;
    const cname = names[nameID];
    const soff = offset0 + count * 12 + noffset;
    let str;
    if (platformID === 0) {
      str = readUnicode(view, soff, slen / 2);
    } else if (platformID === 3 && encodingID === 0) {
      str = readUnicode(view, soff, slen / 2);
    } else if (encodingID === 0) {
      str = readASCII(view, soff, slen);
    } else if (encodingID === 1) {
      str = readUnicode(view, soff, slen / 2);
    } else if (encodingID === 3) {
      str = readUnicode(view, soff, slen / 2);
    } else if (platformID === 1) {
      str = readASCII(view, soff, slen);
      console.log("reading unknown MAC encoding " + encodingID + " as ASCII");
    } else {
      throw new Error(
        "unknown encoding " + encodingID + ", platformID: " + platformID
      );
    }
    const tid = "p" + platformID + "," + languageID.toString(16);
    if (obj[tid] == null) {
      obj[tid] = {};
    }
    obj[tid][cname] = str;
    obj[tid]._lang = languageID;
  }

  for (const p in obj) {
    if (obj[p].postScriptName != null) {
      return obj[p];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tname: any;
  for (const p in obj) {
    tname = p;
    break;
  }
  console.log("returning name table with languageID " + obj[tname]._lang);
  return obj[tname];
};
