import { mkdir, writeFile } from "node:fs/promises";

const assets = [
  {
    name: "Monica Steam icon",
    url: "https://raw.githubusercontent.com/JoyinJoester/Monica-Steam/main/image/monica_launcher.webp",
    output: "../public/monica-steam.webp",
    expectedTypes: ["image/webp", "application/octet-stream"],
  },
  {
    name: "support QR image",
    url: "https://raw.githubusercontent.com/JoyinJoester/Monica-Steam/main/image/support_author.jpg",
    output: "../public/support-author.jpg",
    expectedTypes: ["image/jpeg", "image/jpg", "application/octet-stream"],
  },
];

await mkdir(new URL("../public/", import.meta.url), { recursive: true });

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

  await writeFile(
    new URL(asset.output, import.meta.url),
    Buffer.from(await response.arrayBuffer()),
  );

  console.log(`Prepared ${asset.output.replace("../", "")} from the Monica Steam upstream repository.`);
}
