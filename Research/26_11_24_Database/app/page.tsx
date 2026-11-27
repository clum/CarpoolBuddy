import { DatabaseForm } from "./database-form";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="CarpoolBuddy home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>CarpoolBuddy</span>
        </a>
        <nav className="header-actions" aria-label="Main navigation">
          <a className="admin-link" href="/admin">Admin records</a>
          <span className="local-badge"><span aria-hidden="true" /> Local demo</span>
        </nav>
      </header>

      <div className="content-wrap">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">A simple ride details form</p>
          <h1 id="page-title">Plan a carpool</h1>
          <p className="intro-copy">
            Choose whether to add a User, Vehicle, or Trip. Each submission
            saves one new record to the selected table.
          </p>
        </section>

        <DatabaseForm />

        <footer className="page-footer">
          Only the selected record type is saved with each submission.
        </footer>
      </div>
    </main>
  );
}
