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

Open **http://localhost:3000**. `db:setup` builds the local Worker configuration and applies the initial migration to the local D1 database. The database state is kept under `.wrangler/state` and is ignored by Git.

The form validates required fields in the browser and again on the server. Comments are optional. A successful submission inserts all three records in one D1 batch, so a failed insert rolls back the whole submission. Run `npm run db:setup` once for a new local database; it applies the initial migration and is not intended to be replayed after initialization.

## Database changes

Update `db/schema.ts`, generate a Drizzle migration with `npm run db:generate`, and apply each new migration to the local D1 database with Wrangler. Do not replay the initial migration against an already initialized local database.
