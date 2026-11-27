import { env } from "cloudflare:workers";
import { requireChatGPTUser } from "../chatgpt-auth";

export const dynamic = "force-dynamic";

type CellValue = string | number | null;
type RecordRow = Record<string, CellValue>;
type Column = { key: string; label: string };

const userColumns: Column[] = [
  { key: "id", label: "ID" },
  { key: "first_name", label: "First name" },
  { key: "last_name", label: "Last name" },
  { key: "phone_number", label: "Phone number" },
  { key: "email_address", label: "Email address" },
  { key: "comment", label: "Comment" },
  { key: "created_at", label: "Created" },
];

const vehicleColumns: Column[] = [
  { key: "id", label: "ID" },
  { key: "make", label: "Make" },
  { key: "model", label: "Model" },
  { key: "year", label: "Year" },
  { key: "number_seat_belts", label: "Seat belts" },
  { key: "comment", label: "Comment" },
  { key: "created_at", label: "Created" },
];

const tripColumns: Column[] = [
  { key: "id", label: "ID" },
  { key: "starting_address", label: "Starting address" },
  { key: "ending_address", label: "Ending address" },
  { key: "departure_date", label: "Departure date" },
  { key: "departure_time", label: "Departure time" },
  { key: "arrival_date", label: "Arrival date" },
  { key: "estimated_arrival_time", label: "Estimated arrival" },
  { key: "comment", label: "Comment" },
  { key: "created_at", label: "Created" },
];

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const allowedEmail = env.SITE_ADMIN_EMAIL?.trim().toLowerCase();

  if (!allowedEmail || user.email.trim().toLowerCase() !== allowedEmail) {
    return (
      <main className="admin-page">
        <a className="admin-back" href="/">Back to form</a>
        <section className="admin-notice" role="alert">
          <h1>Access denied</h1>
          <p>This signed-in account is not allowed to view database records.</p>
        </section>
      </main>
    );
  }

  if (!env.DB) {
    return <AdminNotice title="Database unavailable" message="The records could not be loaded right now." />;
  }

  try {
    const [userResult, vehicleResult, tripResult] = await env.DB.batch([
      env.DB.prepare("SELECT id, first_name, last_name, phone_number, email_address, comment, created_at FROM users ORDER BY id DESC"),
      env.DB.prepare("SELECT id, make, model, year, number_seat_belts, comment, created_at FROM vehicles ORDER BY id DESC"),
      env.DB.prepare("SELECT id, starting_address, ending_address, departure_date, arrival_date, departure_time, estimated_arrival_time, comment, created_at FROM trips ORDER BY id DESC"),
    ]);

    return (
      <main className="admin-page">
        <div className="admin-topline">
          <div>
            <p className="eyebrow">CarpoolBuddy database</p>
            <h1>Admin records</h1>
          </div>
          <a className="admin-back" href="/">Back to form</a>
        </div>
        <p className="intro-copy">Signed in as {user.email}. Records are shown newest first.</p>
        <RecordTable title="Users" columns={userColumns} rows={userResult.results as unknown as RecordRow[]} />
        <RecordTable title="Vehicles" columns={vehicleColumns} rows={vehicleResult.results as unknown as RecordRow[]} />
        <RecordTable title="Trips" columns={tripColumns} rows={tripResult.results as unknown as RecordRow[]} />
      </main>
    );
  } catch {
    return <AdminNotice title="Records unavailable" message="The database could not load records. Please try again later." error />;
  }
}

function RecordTable({ title, columns, rows }: { title: string; columns: Column[]; rows: RecordRow[] }) {
  return (
    <section className="admin-card" aria-label={`${title} database records`}>
      <div className="admin-card-heading">
        <h2>{title}</h2>
        <span className="record-count">{rows.length} {rows.length === 1 ? "record" : "records"}</span>
      </div>
      {rows.length === 0 ? (
        <p className="empty-records">No {title.toLowerCase()} have been saved yet.</p>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>{columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={String(row.id ?? rowIndex)}>
                  {columns.map((column) => {
                    const value = row[column.key];
                    return <td key={column.key}>{value === null || value === "" ? "—" : String(value)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AdminNotice({ title, message, error = false }: { title: string; message: string; error?: boolean }) {
  return (
    <main className="admin-page">
      <a className="admin-back" href="/">Back to form</a>
      <section className={`admin-notice${error ? " admin-error" : ""}`} role={error ? "alert" : "status"}>
        <h1>{title}</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}
