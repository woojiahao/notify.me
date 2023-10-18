CREATE TABLE collections
(
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT   NOT NULL CHECK (TRIM(name) <> ''),
    entry_identifiers TEXT[] NOT NULL,
    project_id        UUID   NOT NULL REFERENCES projects (id)
);
