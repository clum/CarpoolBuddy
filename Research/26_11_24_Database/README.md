# CarpoolBuddy Database Demo

A local Vinext form backed by a D1-compatible SQLite database. Choose User, Vehicle, or Trip and submit one new record to the selected table at a time.

## Requirements

- Node.js `>=22.13.0`
- npm

## Install and run

From this folder, run:

```powershell
npm run install:ci
Copy-Item .dev.vars.example .dev.vars
npm run db:setup
npm run dev
```

Open **http://localhost:3000**. `db:setup` builds the local Worker configuration and applies all Drizzle migrations in order to a fresh local D1 database. The database state is kept under `.wrangler/state` and is ignored by Git.

The form validates required fields in the browser and again on the server. Comments are optional. Trip dates and times use local date and 24-hour time inputs. Each successful submission inserts a single record into only the selected table. Run `npm run db:setup` once for a new local database; it applies the migrations and is not intended to be replayed after initialization.

## Admin records

Open **http://localhost:3000/admin** to view every saved user, vehicle, and trip record. The page requires ChatGPT sign-in and checks the signed-in email against `SITE_ADMIN_EMAIL` on the server. Local preview uses the mock identity `seedy@sites.test`, configured in the ignored `.dev.vars` file copied from `.dev.vars.example`. The page is read-only and shows all columns, newest records first.

For a hosted deployment, set `SITE_ADMIN_EMAIL` as a runtime secret to the approved administrator email. Access is denied when the value is missing or does not match. Do not expose the database records through client-side code or public endpoints.

## Database changes

Update `db/schema.ts`, generate a Drizzle migration with `npm run db:generate`, then apply the new migration without replaying earlier ones:

```powershell
npm run db:migrate:local -- drizzle/0001_migration_name.sql
```

Replace the filename with the newly generated migration. The command applies only that file to the local database and preserves existing rows. Use `npm run db:setup` only once when creating a fresh local database.
