-- name: CreateUser :execresult
INSERT INTO
    users (email, password, activation_token, activation_expiration)
VALUES
    (?, ?, ?, ?);

-- name: GetUserByEmail :one
SELECT * FROM
    users
WHERE
    email = ?;

-- name: GetUserByID :one
SELECT * FROM
    users
WHERE
    id = ?;

-- name: GetUserByActivationToken :one
SELECT * FROM
    users
WHERE
    activation_token = ?;

-- name: ActivateUser :exec
UPDATE
    users
SET
    is_active = 1, activation_token = NULL, activation_expiration = NULL
WHERE
    activation_token = ?;

-- name: SetPasswordResetToken :exec
UPDATE
    users
SET
    password_reset_token = ?, password_reset_expiration = ?
WHERE
    email = ?;

-- name: GetUserByPasswordResetToken :one
SELECT * FROM
    users
WHERE
    password_reset_token = ?;

-- name: SetUserPassword :exec
UPDATE
    users
SET
    password = ?, password_reset_token = NULL, password_reset_expiration = NULL
WHERE
    password_reset_token = ?;