-- name: CreateProduct :execresult
INSERT INTO
    products (user_id, title, description, price)
VALUES
    (?, ?, ?, ?);

-- name: CreateProductImage :execresult
INSERT INTO
    products_images (product_id, path)
VALUES
    (?, ?);