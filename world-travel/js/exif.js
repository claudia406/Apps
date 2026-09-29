// Minimal EXIF DateTimeOriginal reader for JPEG files.
// Reads only the header segments (no full library) to keep this dependency-free.

function readExifDate(view, tiffStart, littleEndian) {
  const tagCount = view.getUint16(tiffStart + 8, littleEndian);
  let ifdOffset = tiffStart + 8;
  const entries = view.getUint16(ifdOffset, littleEndian);
  let exifIfdPointer = null;

  for (let i = 0; i < entries; i++) {
    const entryOffset = ifdOffset + 2 + i * 12;
    const tag = view.getUint16(entryOffset, littleEndian);
    if (tag === 0x8769) {
      exifIfdPointer = view.getUint32(entryOffset + 8, littleEndian);
      break;
    }
  }
  if (exifIfdPointer === null) return null;

  const exifStart = tiffStart + exifIfdPointer;
  const exifEntries = view.getUint16(exifStart, littleEndian);
  for (let i = 0; i < exifEntries; i++) {
    const entryOffset = exifStart + 2 + i * 12;
    const tag = view.getUint16(entryOffset, littleEndian);
    // 0x9003 = DateTimeOriginal, 0x9004 = DateTimeDigitized
    if (tag === 0x9003 || tag === 0x9004) {
      const valueOffset = view.getUint32(entryOffset + 8, littleEndian);
      const strStart = tiffStart + valueOffset;
      let str = '';
      for (let j = 0; j < 19; j++) {
        const code = view.getUint8(strStart + j);
        if (code === 0) break;
        str += String.fromCharCode(code);
      }
      // format: "YYYY:MM:DD HH:MM:SS"
      const m = str.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
      if (m) {
        const [, y, mo, d, h, mi, s] = m;
        const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
        if (!isNaN(date.getTime())) return date;
      }
    }
  }
  return null;
}

export async function getPhotoCaptureDate(file) {
  try {
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') return null;
    const buf = await file.slice(0, 128 * 1024).arrayBuffer();
    const view = new DataView(buf);
    if (view.getUint16(0) !== 0xffd8) return null;

    let offset = 2;
    while (offset < view.byteLength - 4) {
      const marker = view.getUint16(offset);
      if ((marker & 0xff00) !== 0xff00) break;
      if (marker === 0xffe1) {
        const segmentStart = offset + 4;
        const exifHeader = view.getUint32(segmentStart);
        if ((exifHeader >>> 8) === 0x457869 || exifHeader === 0x45786966) {
          const tiffStart = segmentStart + 6;
          const endian = view.getUint16(tiffStart);
          const littleEndian = endian === 0x4949;
          const date = readExifDate(view, tiffStart, littleEndian);
          if (date) return date;
        }
      }
      if (marker === 0xffda) break; // start of scan, no more metadata
      const size = view.getUint16(offset + 2);
      offset += 2 + size;
    }
  } catch {
    // fall through to null
  }
  return null;
}
