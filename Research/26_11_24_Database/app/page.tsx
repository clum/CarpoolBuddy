import { DatabaseForm } from "./database-form";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="CarpoolBuddy home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>CarpoolBuddy</span>
        </a>
        <span className="local-badge"><span aria-hidden="true" /> Local demo</span>
      </header>

      <div className="content-wrap">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">A simple ride details form</p>
          <h1 id="page-title">Plan a carpool</h1>
          <p className="intro-copy">
            Add the contact, vehicle, and trip details below. This local demo
            saves each section as its own database record.
          </p>
        </section>

        <DatabaseForm />

        <footer className="page-footer">
          Your details are saved to the local development database.
        </footer>
      </div>
    </main>
  );
}
