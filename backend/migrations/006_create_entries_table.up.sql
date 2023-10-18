CREATE TABLE entries
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contents      JSON NOT NULL,
    collection_id UUID NOT NULL REFERENCES collections (id)
);
