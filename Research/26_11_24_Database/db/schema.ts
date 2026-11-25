import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  emailAddress: text("email_address").notNull(),
  comment: text("comment"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const vehicles = sqliteTable(
  "vehicles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    make: text("make").notNull(),
    model: text("model").notNull(),
    year: integer("year").notNull(),
    numberSeatBelts: integer("number_seat_belts").notNull(),
    comment: text("comment"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    check("vehicles_year_minimum", sql`${table.year} >= 1886`),
    check("vehicles_seat_belts_positive", sql`${table.numberSeatBelts} > 0`),
  ],
);

export const trips = sqliteTable("trips", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startingAddress: text("starting_address").notNull(),
  endingAddress: text("ending_address").notNull(),
  departureTime: text("departure_time").notNull(),
  estimatedArrivalTime: text("estimated_arrival_time").notNull(),
  comment: text("comment"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
