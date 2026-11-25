# CarpoolBuddy Database Demo

A local Vinext form backed by a D1-compatible SQLite database. The form saves one user, one vehicle, and one trip record per submission. Records are stored independently.

## Requirements

- Node.js `>=22.13.0`
- npm

## Install and run

From this folder, run:

```powershell
npm run install:ci
npm run db:setup
npm run dev
```

Open **http://localhost:3000**. `db:setup` builds the local Worker configuration and applies all Drizzle migrations in order to a fresh local D1 database. The database state is kept under `.wrangler/state` and is ignored by Git.

The form validates required fields in the browser and again on the server. Comments are optional. Trip dates and times use local date and 24-hour time inputs. A successful submission inserts all three records in one D1 batch, so a failed insert rolls back the whole submission. Run `npm run db:setup` once for a new local database; it applies the migrations and is not intended to be replayed after initialization.

## Database changes

Update `db/schema.ts`, generate a Drizzle migration with `npm run db:generate`, then apply the new migration without replaying earlier ones:

```powershell
npm run db:migrate:local -- drizzle/0001_migration_name.sql
```

Replace the filename with the newly generated migration. The command applies only that file to the local database and preserves existing rows. Use `npm run db:setup` only once when creating a fresh local database.
