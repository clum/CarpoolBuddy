import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const node = process.execPath;

function run(args, label) {
  const result = spawnSync(node, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  console.log(`Completed: ${label}`);
}

run([path.join(root, "scripts", "run-framework.mjs"), "build"], "build local D1 configuration");
run(
  [
    "--import", "./scripts/sites-env.mjs",
    "./node_modules/wrangler/bin/wrangler.js",
    "d1", "execute", "DB", "--local",
    "--config", path.join(root, "dist", "server", "wrangler.json"),
    "--persist-to", path.join(root, ".wrangler", "state"),
    "--file", path.join(root, "drizzle", "0000_curly_union_jack.sql"),
  ],
  "initialize the local database",
);
