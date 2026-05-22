import { deflateSync } from "node:zlib";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = fileURLToPath(new URL("..", import.meta.url));
const SCALE = 4;

const COLORS = {
  bg: [15, 23, 42, 255],
  t2a: [124, 58, 237, 255],
  a2a: [236, 72, 153, 255],
  inpaint: [245, 158, 11, 255],
};

const BARS = [
  { x: 13, y: 16, h: 12, group: "t2a" },
  { x: 18, y: 11, h: 10, group: "t2a" },
  { x: 23, y: 14, h: 14, group: "a2a" },
  { x: 23, y: 24, h: 10, group: "a2a" },
  { x: 23, y: 30, h: 7, group: "inpaint" },
  { x: 28, y: 27, h: 10, group: "inpaint" },
  { x: 33, y: 22, h: 14, group: "inpaint" },
];

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i += 1) {
  let c = i;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c >>> 0;
}

function crc32(bytes) {
  let c = 0xffffffff;
  for (const byte of bytes) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([length, typeBytes, data, crc]);
}

function encodePng(width, height, rgba) {
  const scanlineLength = width * 4 + 1;
  const raw = Buffer.alloc(scanlineLength * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * scanlineLength;
    raw[rowStart] = 0;
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function setPixel(buffer, width, x, y, rgba) {
  if (x < 0 || y < 0 || x >= width) return;
  const index = (y * width + x) * 4;
  buffer[index] = rgba[0];
  buffer[index + 1] = rgba[1];
  buffer[index + 2] = rgba[2];
  buffer[index + 3] = rgba[3];
}

function inRoundedRect(px, py, x, y, width, height, radius) {
  const left = x + radius;
  const right = x + width - radius;
  const top = y + radius;
  const bottom = y + height - radius;
  if (px >= left && px <= right && py >= y && py <= y + height) return true;
  if (py >= top && py <= bottom && px >= x && px <= x + width) return true;
  const cx = px < left ? left : right;
  const cy = py < top ? top : bottom;
  return (px - cx) ** 2 + (py - cy) ** 2 <= radius ** 2;
}

function fillRoundedRect(buffer, width, height, rect, rgba) {
  const minX = Math.max(0, Math.floor(rect.x));
  const minY = Math.max(0, Math.floor(rect.y));
  const maxX = Math.min(width, Math.ceil(rect.x + rect.w));
  const maxY = Math.min(height, Math.ceil(rect.y + rect.h));
  for (let y = minY; y < maxY; y += 1) {
    for (let x = minX; x < maxX; x += 1) {
      if (inRoundedRect(x + 0.5, y + 0.5, rect.x, rect.y, rect.w, rect.h, rect.r)) {
        setPixel(buffer, width, x, y, rgba);
      }
    }
  }
}

function renderHighRes(size) {
  const width = size * SCALE;
  const height = size * SCALE;
  const image = Buffer.alloc(width * height * 4);
  const unit = width / 48;

  fillRoundedRect(image, width, height, {
    x: 0,
    y: 0,
    w: 48 * unit,
    h: 48 * unit,
    r: 11 * unit,
  }, COLORS.bg);

  for (const bar of BARS) {
    fillRoundedRect(image, width, height, {
      x: bar.x * unit,
      y: bar.y * unit,
      w: 5 * unit,
      h: bar.h * unit,
      r: 2.5 * unit,
    }, COLORS[bar.group]);
  }

  return { image, width, height };
}

function downsample({ image, width }, size) {
  const output = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sums = [0, 0, 0, 0];
      for (let sy = 0; sy < SCALE; sy += 1) {
        for (let sx = 0; sx < SCALE; sx += 1) {
          const index = ((y * SCALE + sy) * width + x * SCALE + sx) * 4;
          sums[0] += image[index];
          sums[1] += image[index + 1];
          sums[2] += image[index + 2];
          sums[3] += image[index + 3];
        }
      }
      const out = (y * size + x) * 4;
      output[out] = Math.round(sums[0] / (SCALE * SCALE));
      output[out + 1] = Math.round(sums[1] / (SCALE * SCALE));
      output[out + 2] = Math.round(sums[2] / (SCALE * SCALE));
      output[out + 3] = Math.round(sums[3] / (SCALE * SCALE));
    }
  }
  return output;
}

function renderPng(size) {
  return encodePng(size, size, downsample(renderHighRes(size), size));
}

function encodeIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const dirs = [];
  for (const entry of entries) {
    const dir = Buffer.alloc(16);
    dir[0] = entry.size === 256 ? 0 : entry.size;
    dir[1] = entry.size === 256 ? 0 : entry.size;
    dir[2] = 0;
    dir[3] = 0;
    dir.writeUInt16LE(1, 4);
    dir.writeUInt16LE(32, 6);
    dir.writeUInt32LE(entry.png.length, 8);
    dir.writeUInt32LE(offset, 12);
    dirs.push(dir);
    offset += entry.png.length;
  }
  return Buffer.concat([header, ...dirs, ...entries.map((entry) => entry.png)]);
}

const files = [
  ["public/favicon-16x16.png", renderPng(16)],
  ["public/favicon-32x32.png", renderPng(32)],
  ["public/apple-touch-icon.png", renderPng(180)],
  ["public/android-chrome-192x192.png", renderPng(192)],
  ["public/android-chrome-512x512.png", renderPng(512)],
];

const faviconIco = encodeIco([
  { size: 16, png: renderPng(16) },
  { size: 32, png: renderPng(32) },
  { size: 48, png: renderPng(48) },
]);

files.push(["public/favicon.ico", faviconIco], ["app/favicon.ico", faviconIco]);

for (const [relativePath, data] of files) {
  const target = join(OUT_DIR, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, data);
  console.log(`wrote ${relativePath}`);
}

const written = readFileSync(join(OUT_DIR, "public/favicon-32x32.png"));
if (!written.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
  throw new Error("Generated favicon PNG is invalid.");
}
