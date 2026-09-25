const utf8 = new TextEncoder();
const decodeUtf8 = new TextDecoder();
const decodeLatin1 = new TextDecoder("latin1");
const decodeUtf16 = new TextDecoder("utf-16le");

export class ByteReader {
  private offset = 0;

  constructor(private readonly data: Uint8Array) {}

  seek(pos: number): void {
    this.offset = pos;
  }

  readBytes(n: number): Uint8Array {
    if (this.offset + n > this.data.length) {
      throw new Error("Unexpected end of save data");
    }
    const slice = this.data.subarray(this.offset, this.offset + n);
    this.offset += n;
    return slice;
  }

  readInt32(): number {
    const value = readU32LE(this.data, this.offset);
    this.offset += 4;
    return value | 0;
  }

  readFString(): string {
    const length = this.readInt32();
    if (length === 0) {
      return "";
    }
    if (length < 0) {
      const bytes = this.readBytes((-length) * 2);
      return decodeUtf16.decode(bytes).replace(/\0+$/, "");
    }
    const bytes = this.readBytes(length);
    return decodeUtf8.decode(bytes.subarray(0, Math.max(0, length - 1)));
  }
}

export function readU32LE(data: Uint8Array, offset: number): number {
  return (
    data[offset]! |
    (data[offset + 1]! << 8) |
    (data[offset + 2]! << 16) |
    (data[offset + 3]! << 24)
  ) >>> 0;
}

export function toUtf8(data: Uint8Array): string {
  return decodeUtf8.decode(data);
}

export function toLatin1(data: Uint8Array): string {
  return decodeLatin1.decode(data);
}

export function findAscii(data: Uint8Array, ascii: string, from = 0): number {
  const needle = utf8.encode(ascii);
  outer: for (let i = from; i <= data.length - needle.length; i += 1) {
    for (let j = 0; j < needle.length; j += 1) {
      if (data[i + j] !== needle[j]) {
        continue outer;
      }
    }
    return i;
  }
  return -1;
}

export function collectAsciiOccurrences(data: Uint8Array, prefix: string): string[] {
  const needle = utf8.encode(prefix);
  const found = new Set<string>();
  let start = 0;
  while (start < data.length) {
    const idx = findAscii(data, prefix, start);
    if (idx < 0) {
      break;
    }
    let end = idx;
    while (end < data.length && data[end] !== 0 && data[end]! >= 32 && data[end]! < 127) {
      end += 1;
    }
    found.add(toUtf8(data.subarray(idx, end)));
    start = idx + Math.max(1, needle.length);
  }
  return [...found].sort();
}

export function hasAscii(data: Uint8Array, ascii: string): boolean {
  return findAscii(data, ascii) >= 0;
}

export function startsWithAscii(data: Uint8Array, ascii: string): boolean {
  const needle = utf8.encode(ascii);
  if (data.length < needle.length) {
    return false;
  }
  return needle.every((byte, index) => data[index] === byte);
}
