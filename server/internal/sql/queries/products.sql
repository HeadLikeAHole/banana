-- name: CreateProduct :execresult
INSERT INTO
    products (user_id, title, description, price)
VALUES
    (?, ?, ?, ?);

-- name: CreateProductImage :execresult
INSERT INTO
    product_images (product_id, path)
VALUES
    (?, ?);

-- name: GetProductByID :one
SELECT * FROM
    products
WHERE
    id = ?;

-- name: GetProductImages :many
SELECT * FROM
    product_images
WHERE
    product_id = ?;