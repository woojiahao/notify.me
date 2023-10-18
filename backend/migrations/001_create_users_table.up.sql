CREATE TABLE users
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT CHECK (TRIM(name) <> '') NOT NULL,
    email         TEXT                          NOT NULL,
    password_hash TEXT                          NOT NULL
);
