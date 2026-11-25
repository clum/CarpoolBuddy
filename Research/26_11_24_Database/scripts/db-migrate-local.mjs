import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const migrationArgument = process.argv[2];

if (!migrationArgument) {
  throw new Error("Usage: npm run db:migrate:local -- drizzle/<migration>.sql");
}

const migrationPath = path.resolve(root, migrationArgument);
const migrationsDirectory = path.resolve(root, "drizzle");
const relativeMigrationPath = path.relative(migrationsDirectory, migrationPath);
if (
  !relativeMigrationPath ||
  relativeMigrationPath.startsWith(`..${path.sep}`) ||
  path.isAbsolute(relativeMigrationPath) ||
  path.extname(migrationPath).toLowerCase() !== ".sql" ||
  !existsSync(migrationPath)
) {
  throw new Error("Migration must be an existing .sql file inside the drizzle directory.");
}

function run(args, label) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`Completed: ${label}`);
}

const wranglerConfig = path.join(root, "dist", "server", "wrangler.json");
if (!existsSync(wranglerConfig)) {
  run([path.join(root, "scripts", "run-framework.mjs"), "build"], "build local D1 configuration");
}

run(
  [
    "--import", "./scripts/sites-env.mjs",
    "./node_modules/wrangler/bin/wrangler.js",
    "d1", "execute", "DB", "--local",
    "--config", wranglerConfig,
    "--persist-to", path.join(root, ".wrangler", "state"),
    "--file", migrationPath,
  ],
  `apply ${path.basename(migrationPath)} to the local database`,
);
