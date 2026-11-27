# Database and Form Project Guide

Use this guide when building the database-backed web form in this folder. It defines the required first version and its local development target.

## Goal

Build a small web application with a database that stores multiple records for users, vehicles, and trips. Provide a web form where a user selects one entity type and adds one record to the corresponding table per submission. Run the application locally so it can be tested in a browser.

## Data Model

Create three persisted entity types. Give every record a stable primary key and use appropriate database types and constraints.

- **User**: `first_name`, `last_name`, `phone_number`, `email_address`, `comment`
- **Vehicle**: `make`, `model`, `year`, `number_seat_belts`, `comment`
- **Trip**: `starting_address`, `ending_address`, `departure_date`, `arrival_date`, `departure_time`, `estimated_arrival_time`, `comment`

The database must support multiple records of each entity type. Keep the three entities in separate tables/collections. Add created/updated timestamps if supported by the chosen database. Store comments as optional text. Do not silently discard submitted values.

If the implementation associates a trip with a user and vehicle, represent those associations with foreign keys (or equivalent references) and document the relationship and deletion behavior. Do not use names or email addresses as record IDs.

## Example Form

Create one simple, accessible page with a required dropdown offering **User**, **Vehicle**, and **Trip**. After one type is selected, show only that type's form fields. Include an input for every attribute of the selected type. Use suitable controls and browser-level hints, such as email and phone input types, a numeric year, a positive integer for seat belts, date inputs for departure and arrival, and time inputs for departure and estimated arrival. Comments may use multiline text areas.

The form must:

- Require the core identifying and descriptive fields needed to create each record; comments may be left blank.
- Validate and normalize input on the server as well as in the browser.
- Show a clear success message after the records are saved and a useful error message if saving fails.
- Avoid placing database credentials or privileged database operations in browser code.
- Keep the layout usable on both phone and desktop screens.

On submission, validate and insert one record of the selected type into only its corresponding table. Do not write to the other entity tables during that submission. A failed insert must not create a record.

## Administrator Page

Provide a read-only `/admin` page that displays all records and columns from the User, Vehicle, and Trip tables, newest first. Include record counts, useful empty states, and a generic database error state. Keep the layout usable on narrow screens with horizontally scrollable tables.

Require ChatGPT sign-in and enforce an exact, case-insensitive administrator email allowlist on the server before querying any records. Read the allowed address from the `SITE_ADMIN_EMAIL` runtime environment value. For local preview, use the existing mock identity `seedy@sites.test` through an ignored `.dev.vars` file and provide a tracked `.dev.vars.example`. Deny access when the allowlist is missing or the signed-in email does not match. Do not return records to unauthorized visitors, expose database access in client code, or add edit/delete/export actions in this version.

## Local Development

Provide a straightforward setup with prerequisites and commands to install dependencies, initialize/migrate the database, and start the application. Keep local database files and secrets out of version control when appropriate, and provide an example environment file without real credentials if configuration is needed.

Start the development server on loopback and make the form available at:

**http://localhost:3000**

If the selected framework uses a different default port, configure it to use port `3000` or clearly document the actual localhost URL and keep it consistent in the startup output and README.

## Acceptance Criteria

- The three entity types and all requested attributes, including each Trip's departure date, arrival date, departure time, and estimated arrival time, are represented in persistent storage.
- More than one user, vehicle, and trip can be stored without overwriting prior records.
- A visitor can select User, Vehicle, or Trip, complete the matching form, and save one new record to only the corresponding table.
- The `/admin` page shows all saved User, Vehicle, and Trip fields only to the configured administrator account; missing configuration and other accounts receive no records.
- Invalid values and database errors are handled with clear feedback; failed submissions do not create records.
- The application starts locally and the form loads at the documented localhost URL.
- Setup, database initialization, and run instructions are documented in this folder.
