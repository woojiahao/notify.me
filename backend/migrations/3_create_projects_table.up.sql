CREATE TABLE projects
(
    id         UUID PRIMARY KEY   DEFAULT gen_random_uuid(),
    name       TEXT      NOT NULL CHECK (TRIM(name) <> ''),
    created_by UUID      NOT NULL REFERENCES users (id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES users (id),
    updated_at TIMESTAMP
);
