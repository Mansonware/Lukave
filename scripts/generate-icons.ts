import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { resolve } from "path";

async function main() {
  const svgPath = resolve(process.cwd(), "public/icon.svg");
  const outputDir = resolve(process.cwd(), "public/icons");

  mkdirSync(outputDir, { recursive: true });

  const svg = readFileSync(svgPath);

  await sharp(svg).resize(192, 192).png().toFile(resolve(outputDir, "icon-192.png"));
  console.log("✓ icon-192.png");

  await sharp(svg).resize(512, 512).png().toFile(resolve(outputDir, "icon-512.png"));
  console.log("✓ icon-512.png");

  console.log("Ícones gerados em public/icons/");
}

main().catch((err) => { console.error(err); process.exit(1); });
