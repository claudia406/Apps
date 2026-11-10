import sharp from "sharp";
import { mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "src/app/icon.svg");
const outDir = join(root, "public/icons");
mkdirSync(outDir, { recursive: true });

const svg = readFileSync(svgPath);

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

function maskableSvg(innerScale) {
  // maskable 用: セーフゾーン確保のため背景を画面全体に敷き、アイコン本体を中央に縮小配置する
  const original = svg.toString("utf-8");
  const inner = original.replace('width="100" height="100" viewBox="0 0 100 100"', 'width="100" height="100"');
  const offset = (100 - 100 * innerScale) / 2;
  return `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#8FB7AD"/>
    <g transform="translate(${offset}, ${offset}) scale(${innerScale})">
      ${inner.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}
    </g>
  </svg>`;
}

async function run() {
  for (const size of sizes) {
    await sharp(svg).resize(size, size).png().toFile(join(outDir, `icon-${size}.png`));
  }

  const maskable = Buffer.from(maskableSvg(0.68));
  for (const size of [192, 512]) {
    await sharp(maskable).resize(size, size).png().toFile(join(outDir, `icon-${size}-maskable.png`));
  }

  // apple touch icon (iOS はアルファ非対応のため背景色を敷く)
  await sharp(svg).resize(180, 180).flatten({ background: "#DCEBE8" }).png().toFile(join(root, "src/app/apple-icon.png"));

  console.log("icons generated:", outDir);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
