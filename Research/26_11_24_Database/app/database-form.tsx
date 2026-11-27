"use client";

import { useState } from "react";

type RecordType = "user" | "vehicle" | "trip";
type Feedback = { kind: "success" | "error" | "pending"; text: string } | null;

const recordLabels: Record<RecordType, string> = {
  user: "User",
  vehicle: "Vehicle",
  trip: "Trip",
};

export function DatabaseForm() {
  const [selectedType, setSelectedType] = useState<RecordType | "">("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedType) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    let payload: Record<string, unknown>;

    if (selectedType === "user") {
      payload = {
        type: "user",
        firstName: values.get("firstName"),
        lastName: values.get("lastName"),
        phoneNumber: values.get("phoneNumber"),
        emailAddress: values.get("emailAddress"),
        comment: values.get("comment"),
      };
    } else if (selectedType === "vehicle") {
      payload = {
        type: "vehicle",
        make: values.get("make"),
        model: values.get("model"),
        year: values.get("year"),
        numberSeatBelts: values.get("numberSeatBelts"),
        comment: values.get("comment"),
      };
    } else {
      payload = {
        type: "trip",
        startingAddress: values.get("startingAddress"),
        endingAddress: values.get("endingAddress"),
        departureDate: values.get("departureDate"),
        arrivalDate: values.get("arrivalDate"),
        departureTime: values.get("departureTime"),
        estimatedArrivalTime: values.get("estimatedArrivalTime"),
        comment: values.get("comment"),
      };
    }

    setIsSaving(true);
    setFeedback({ kind: "pending", text: `Saving ${recordLabels[selectedType].toLowerCase()} details...` });

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
      setSelectedType("");
      setFeedback({
        kind: "success",
        text: result.message ?? `${recordLabels[selectedType]} details were saved.`,
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
      <section className="form-section type-picker" aria-labelledby="record-type-heading">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <h2 id="record-type-heading">What would you like to add?</h2>
            <p>Choose one table. Each submission adds one record.</p>
          </div>
        </div>
        <label className="field type-select-field">
          <span>Record type <span className="required">*</span></span>
          <select
            name="recordType"
            value={selectedType}
            required
            onChange={(event) => {
              setSelectedType(event.target.value as RecordType | "");
              setFeedback(null);
            }}
          >
            <option value="">Choose a table...</option>
            <option value="user">User</option>
            <option value="vehicle">Vehicle</option>
            <option value="trip">Trip</option>
          </select>
        </label>
      </section>

      {selectedType === "user" && (
        <section className="form-section" aria-labelledby="user-heading">
          <div className="section-heading">
            <span className="section-number">02</span>
            <div>
              <h2 id="user-heading">User</h2>
              <p>How can your carpool group reach this person?</p>
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
              <textarea name="comment" rows={2} maxLength={2000} placeholder="Anything else the carpool group should know?" />
            </label>
          </div>
        </section>
      )}

      {selectedType === "vehicle" && (
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
              <textarea name="comment" rows={2} maxLength={2000} placeholder="Add a color or other helpful detail." />
            </label>
          </div>
        </section>
      )}

      {selectedType === "trip" && (
        <section className="form-section" aria-labelledby="trip-heading">
          <div className="section-heading">
            <span className="section-number">02</span>
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
              <span>Departure date <span className="required">*</span></span>
              <input name="departureDate" type="date" required />
            </label>
            <label className="field">
              <span>Arrival date <span className="required">*</span></span>
              <input name="arrivalDate" type="date" required />
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
              <textarea name="comment" rows={2} maxLength={2000} placeholder="Add a meeting point or trip note." />
            </label>
          </div>
        </section>
      )}

      {selectedType && (
        <div className="submit-row">
          <p>Fields marked <span className="required">*</span> are required.</p>
          <button className="submit-button" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : `Save ${recordLabels[selectedType].toLowerCase()}`}
          </button>
        </div>
      )}

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
