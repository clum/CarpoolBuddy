"use client";

import { useState } from "react";

type Feedback = { kind: "success" | "error" | "pending"; text: string } | null;

export function DatabaseForm() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setIsSaving(true);
    setFeedback({ kind: "pending", text: "Saving your details…" });

    const payload = {
      user: {
        firstName: values.get("firstName"),
        lastName: values.get("lastName"),
        phoneNumber: values.get("phoneNumber"),
        emailAddress: values.get("emailAddress"),
        comment: values.get("userComment"),
      },
      vehicle: {
        make: values.get("make"),
        model: values.get("model"),
        year: values.get("year"),
        numberSeatBelts: values.get("numberSeatBelts"),
        comment: values.get("vehicleComment"),
      },
      trip: {
        startingAddress: values.get("startingAddress"),
        endingAddress: values.get("endingAddress"),
        departureTime: values.get("departureTime"),
        estimatedArrivalTime: values.get("estimatedArrivalTime"),
        comment: values.get("tripComment"),
      },
    };

    try {
      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setFeedback({
          kind: "error",
          text: result.error ?? "We could not save these details. Please try again.",
        });
        return;
      }

      form.reset();
      setFeedback({
        kind: "success",
        text: result.message ?? "Your user, vehicle, and trip details were saved.",
      });
    } catch {
      setFeedback({
        kind: "error",
        text: "The server could not be reached. Check that the local app is running and try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      <section className="form-section" aria-labelledby="user-heading">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <h2 id="user-heading">Your details</h2>
            <p>How can your carpool group reach you?</p>
          </div>
        </div>
        <div className="field-grid">
          <label className="field">
            <span>First name <span className="required">*</span></span>
            <input name="firstName" autoComplete="given-name" maxLength={100} required />
          </label>
          <label className="field">
            <span>Last name <span className="required">*</span></span>
            <input name="lastName" autoComplete="family-name" maxLength={100} required />
          </label>
          <label className="field">
            <span>Phone number <span className="required">*</span></span>
            <input name="phoneNumber" type="tel" autoComplete="tel" maxLength={40} required />
          </label>
          <label className="field">
            <span>Email address <span className="required">*</span></span>
            <input name="emailAddress" type="email" autoComplete="email" maxLength={254} required />
          </label>
          <label className="field field-full">
            <span>Comment <span className="optional">Optional</span></span>
            <textarea name="userComment" rows={2} maxLength={2000} placeholder="Anything else your group should know?" />
          </label>
        </div>
      </section>

      <section className="form-section" aria-labelledby="vehicle-heading">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div>
            <h2 id="vehicle-heading">Vehicle</h2>
            <p>Share the vehicle details for this ride.</p>
          </div>
        </div>
        <div className="field-grid">
          <label className="field">
            <span>Make <span className="required">*</span></span>
            <input name="make" autoComplete="off" maxLength={100} required />
          </label>
          <label className="field">
            <span>Model <span className="required">*</span></span>
            <input name="model" autoComplete="off" maxLength={100} required />
          </label>
          <label className="field">
            <span>Year <span className="required">*</span></span>
            <input name="year" type="number" inputMode="numeric" min="1886" max={new Date().getFullYear() + 1} step="1" required />
          </label>
          <label className="field">
            <span>Number of seat belts <span className="required">*</span></span>
            <input name="numberSeatBelts" type="number" inputMode="numeric" min="1" step="1" required />
          </label>
          <label className="field field-full">
            <span>Comment <span className="optional">Optional</span></span>
            <textarea name="vehicleComment" rows={2} maxLength={2000} placeholder="Add a color or other helpful detail." />
          </label>
        </div>
      </section>

      <section className="form-section" aria-labelledby="trip-heading">
        <div className="section-heading">
          <span className="section-number">03</span>
          <div>
            <h2 id="trip-heading">Trip</h2>
            <p>Where is the carpool going, and when?</p>
          </div>
        </div>
        <div className="field-grid">
          <label className="field field-full">
            <span>Starting address <span className="required">*</span></span>
            <input name="startingAddress" autoComplete="street-address" maxLength={500} required />
          </label>
          <label className="field field-full">
            <span>Ending address <span className="required">*</span></span>
            <input name="endingAddress" maxLength={500} required />
          </label>
          <label className="field">
            <span>Departure time <span className="required">*</span></span>
            <input name="departureTime" type="time" required />
            <small>Enter local time in 24-hour format.</small>
          </label>
          <label className="field">
            <span>Estimated time of arrival <span className="required">*</span></span>
            <input name="estimatedArrivalTime" type="time" required />
            <small>Enter local time in 24-hour format.</small>
          </label>
          <label className="field field-full">
            <span>Comment <span className="optional">Optional</span></span>
            <textarea name="tripComment" rows={2} maxLength={2000} placeholder="Add a meeting point or trip note." />
          </label>
        </div>
      </section>

      <div className="submit-row">
        <p>Fields marked <span className="required">*</span> are required.</p>
        <button className="submit-button" type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save trip details"}
        </button>
      </div>

      {feedback && (
        <p
          className={`feedback feedback-${feedback.kind}`}
          role={feedback.kind === "error" ? "alert" : "status"}
          aria-live={feedback.kind === "error" ? "assertive" : "polite"}
        >
          {feedback.text}
        </p>
      )}
    </form>
  );
}
