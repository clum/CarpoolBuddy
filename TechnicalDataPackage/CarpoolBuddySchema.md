# CarpoolBuddy database schema prototype

This Mermaid ER diagram transcribes the four table prototypes from slides 1–4 of `CarpoolBuddyNotes.pptx`. Attribute names, declared types, and constraints follow the updated slides.

```mermaid
erDiagram
    USERS ||--o{ PARTICIPANTS : creates
    USERS ||--o{ VEHICLES : creates
    USERS ||--o{ TRIPS : creates

    USERS {
        INTEGER UserId PK "NOT NULL, UNIQUE"
        TEXT FirstName "NOT NULL"
        TEXT LastName "NOT NULL"
        TEXT EmailAddress UK "NOT NULL, UNIQUE; login ID"
        TEXT DateCreated "NOT NULL; ISO 8601"
        TEXT DateEmailVerified "ISO 8601"
        TEXT PhoneNumber
        TEXT Comment
    }

    PARTICIPANTS {
        INTEGER RiderId PK "NOT NULL, UNIQUE"
        INTEGER CreatedBy FK "NOT NULL; references USERS.UserId"
        TEXT DateCreated "NOT NULL; ISO 8601"
        TEXT FirstName "NOT NULL"
        TEXT LastName
        TEXT EmailAddress
        TEXT PhoneNumber
        TEXT Comment
    }

    VEHICLES {
        INTEGER VehicleId PK "NOT NULL, UNIQUE"
        INTEGER CreatedBy FK "NOT NULL; references USERS.UserId"
        TEXT DateCreated "NOT NULL; ISO 8601"
        TEXT Make
        TEXT Model
        TEXT Year
        TEXT Color
        INTEGER NumberAvailableSeats "NOT NULL"
        TEXT Comment
    }

    TRIPS {
        INTEGER TripId PK "NOT NULL, UNIQUE"
        INTEGER CreatedBy FK "NOT NULL; references USERS.UserId"
        TEXT DateCreated "NOT NULL; ISO 8601"
        TEXT DepartureLocation "NOT NULL"
        TEXT DepartureDateTime "NOT NULL; ISO 8601"
        TEXT ArrivalLocation
        TEXT ArrivalDateTime "ISO 8601"
        TEXT LocationTrackingUrl
        TEXT PublicTripNotes
        TEXT Comment
    }
```

## Consistency review

- All three `CreatedBy` fields now use `INTEGER` and reference the `INTEGER` primary key `USERS.UserId`. The relationships therefore agree across the slides.
- The Trips primary key is now `TripId`, distinct from the Participants primary key `RiderId`.
- All four `DateCreated` fields specify `TEXT NOT NULL` and recommend the same ISO 8601 format.
- Trip departure and arrival are each represented as one ISO 8601 date-time field, avoiding separate date and time attributes. The example `2026-11-26T13:45:41-08:00` includes an explicit UTC offset.
- The slides declare dates and times as `TEXT`; the diagram preserves these prototype types. Consistent application-side validation is needed to ensure stored strings follow ISO 8601.
