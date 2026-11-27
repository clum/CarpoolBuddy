import { env } from "cloudflare:workers";
import { z } from "zod";

const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long.`);

const commentField = z
  .string()
  .max(2000, "Comments must be 2,000 characters or fewer.")
  .optional()
  .default("")
  .transform((value) => value.trim() || null);

const timeField = (label: string) =>
  z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, `${label} must be a valid 24-hour time.`);

const dateField = (label: string) =>
  z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} must be a valid date.`)
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
    }, `${label} must be a valid calendar date.`);

const recordSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("user"),
    firstName: requiredText("First name", 100),
    lastName: requiredText("Last name", 100),
    phoneNumber: requiredText("Phone number", 40),
    emailAddress: z.string().trim().toLowerCase().email("Enter a valid email address.").max(254),
    comment: commentField,
  }),
  z.object({
    type: z.literal("vehicle"),
    make: requiredText("Vehicle make", 100),
    model: requiredText("Vehicle model", 100),
    year: z.coerce.number().int().min(1886, "Enter a valid vehicle year.").max(new Date().getFullYear() + 1, "Vehicle year is too far in the future."),
    numberSeatBelts: z.coerce.number().int().min(1, "The vehicle must have at least one seat belt."),
    comment: commentField,
  }),
  z.object({
    type: z.literal("trip"),
    startingAddress: requiredText("Starting address", 500),
    endingAddress: requiredText("Ending address", 500),
    departureDate: dateField("Departure date"),
    arrivalDate: dateField("Arrival date"),
    departureTime: timeField("Departure time"),
    estimatedArrivalTime: timeField("Estimated arrival time"),
    comment: commentField,
  }),
]);

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const parsed = recordSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Please check the form and try again." }, { status: 400 });
  }

  if (!env.DB) {
    return Response.json({ error: "The local database is not available. Run the database setup command and try again." }, { status: 503 });
  }

  try {
    switch (parsed.data.type) {
      case "user": {
        const user = parsed.data;
        await env.DB.prepare(
          "INSERT INTO users (first_name, last_name, phone_number, email_address, comment) VALUES (?, ?, ?, ?, ?)",
        ).bind(user.firstName, user.lastName, user.phoneNumber, user.emailAddress, user.comment).run();
        return Response.json({ message: "User record saved." }, { status: 201 });
      }
      case "vehicle": {
        const vehicle = parsed.data;
        await env.DB.prepare(
          "INSERT INTO vehicles (make, model, year, number_seat_belts, comment) VALUES (?, ?, ?, ?, ?)",
        ).bind(vehicle.make, vehicle.model, vehicle.year, vehicle.numberSeatBelts, vehicle.comment).run();
        return Response.json({ message: "Vehicle record saved." }, { status: 201 });
      }
      case "trip": {
        const trip = parsed.data;
        await env.DB.prepare(
          "INSERT INTO trips (starting_address, ending_address, departure_date, arrival_date, departure_time, estimated_arrival_time, comment) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ).bind(trip.startingAddress, trip.endingAddress, trip.departureDate, trip.arrivalDate, trip.departureTime, trip.estimatedArrivalTime, trip.comment).run();
        return Response.json({ message: "Trip record saved." }, { status: 201 });
      }
    }
  } catch {
    return Response.json({ error: "We could not save this record right now. Please try again." }, { status: 500 });
  }
}
