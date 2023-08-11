CREATE TYPE user_project_role AS ENUM ('admin','member','viewer');

CREATE TABLE user_projects
(
    user_id    UUID              NOT NULL REFERENCES users (id),
    project_id UUID              NOT NULL REFERENCES projects (id),
    role       user_project_role NOT NULL DEFAULT 'member',
    PRIMARY KEY (user_id, project_id)
);
