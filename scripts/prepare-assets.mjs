import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const publicDir = new URL("../public/", import.meta.url);
const iconOutput = new URL("../public/monica-steam.webp", import.meta.url);
const faviconOutput = new URL("../public/favicon.png", import.meta.url);

const assets = [
  {
    name: "Monica Steam icon",
    url: "https://raw.githubusercontent.com/JoyinJoester/Monica-Steam/main/image/monica_launcher.webp",
    output: iconOutput,
    expectedTypes: ["image/webp", "application/octet-stream"],
    keepBuffer: true,
  },
  {
    name: "support QR image",
    url: "https://raw.githubusercontent.com/JoyinJoester/Monica-Steam/main/image/support_author.jpg",
    output: new URL("../public/support-author.jpg", import.meta.url),
    expectedTypes: ["image/jpeg", "image/jpg", "application/octet-stream"],
  },
];

await mkdir(publicDir, { recursive: true });

let iconBuffer;

for (const asset of assets) {
  const response = await fetch(asset.url, {
    headers: { "user-agent": "monica-steam-docs-build" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download ${asset.name}: ${response.status} ${response.statusText}`,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (!asset.expectedTypes.some((type) => contentType.includes(type))) {
    throw new Error(
      `Unexpected ${asset.name} content type: ${contentType || "unknown"}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(asset.output, buffer);

  if (asset.keepBuffer) iconBuffer = buffer;

  console.log(`Prepared ${asset.output.pathname.split("/").pop()} from the Monica Steam upstream repository.`);
}

if (!iconBuffer) {
  throw new Error("Monica Steam icon was not downloaded; favicon cannot be generated.");
}

// The Android launcher artwork contains breathing room that looks good on a phone,
// but makes the browser tab favicon appear visually too small. Build a dedicated
// 64×64 favicon by trimming that outer padding, then leave only a tiny 2px margin.
// Sharp's toFile() expects a filesystem path string; keep URL handling in Node's
// writeFile() instead so this works consistently on GitHub Actions.
const faviconBuffer = await sharp(iconBuffer)
  .trim({ threshold: 10 })
  .resize(60, 60, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .extend({
    top: 2,
    bottom: 2,
    left: 2,
    right: 2,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(faviconOutput, faviconBuffer);

console.log("Prepared favicon.png with a tighter crop for browser tabs.");
