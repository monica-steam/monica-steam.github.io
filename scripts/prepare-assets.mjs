import { mkdir, writeFile } from "node:fs/promises";

const iconUrl =
  "https://raw.githubusercontent.com/JiangKaslana/Monica-Steam/main/image/monica_launcher.webp";
const outputPath = new URL("../public/monica-steam.webp", import.meta.url);

const response = await fetch(iconUrl, {
  headers: { "user-agent": "monica-steam-docs-build" },
});

if (!response.ok) {
  throw new Error(
    `Failed to download Monica Steam icon: ${response.status} ${response.statusText}`,
  );
}

const contentType = response.headers.get("content-type") || "";
if (!contentType.includes("image/webp") && !contentType.includes("application/octet-stream")) {
  throw new Error(`Unexpected icon content type: ${contentType || "unknown"}`);
}

await mkdir(new URL("../public/", import.meta.url), { recursive: true });
await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));

console.log("Prepared public/monica-steam.webp from the Monica Steam app repository.");
