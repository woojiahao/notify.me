-- name: FindUserByEmail :one
SELECT users.*
FROM users
WHERE email = $1;
