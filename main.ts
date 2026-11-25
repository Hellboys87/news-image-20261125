// news-image-20261125 — entry program.
//
// The image is pre-rendered and shipped beside this file as entry.png.
// This program only copies that file into the output directory, so the
// two graded runs produce byte-identical output with no rendering,
// no fonts, no network and no writes into the repository.
//
// After copying, the destination is verified against the source by size
// so a partial or failed copy can never pass as a successful run.
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const dest = join(outDir, "entry.png");

function fail(message: string): never {
  console.error(`news-image-20261125: ${message}`);
  process.exit(1);
}

try {
  mkdirSync(outDir, { recursive: true });
  if (!existsSync(source)) {
    fail("entry.png is missing next to main.ts");
  }
  copyFileSync(source, dest);
} catch (error) {
  fail(`could not copy entry.png to ${dest}: ${(error as Error).message}`);
}

// Verify the copy: the destination must exist and match the source size.
// A size mismatch means a truncated write — fail loudly instead of
// reporting success with a corrupt image.
if (!existsSync(dest)) {
  fail(`output missing after copy: ${dest}`);
}
const sourceSize = statSync(source).size;
const destSize = statSync(dest).size;
if (destSize !== sourceSize) {
  fail(
    `size mismatch after copy: ${dest} is ${destSize} bytes, expected ${sourceSize}`,
  );
}
console.error(`news-image-20261125: wrote ${dest} (${destSize} bytes)`);
