import { build } from "esbuild";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const outDir = path.resolve("dist");
await mkdir(outDir, { recursive: true });

await build({
  entryPoints: ["api/boot.ts"],
  outfile: path.join(outDir, "boot.js"),
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  sourcemap: true,
  packages: "external",
});

await writeFile(
  path.join(outDir, "package.json"),
  JSON.stringify({ type: "module" }, null, 2) + "\n",
  "utf8"
);
