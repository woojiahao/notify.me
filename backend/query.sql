-- name: FindUserByEmail :one
SELECT users.*
FROM users
WHERE email = $1;

-- name: CreateUser :one
INSERT INTO users (name, email, password_hash)
VALUES ($1, $2, $3)
RETURNING *;
