-- +goose Up
CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description Text NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    path Text NOT NULL,
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
            REFERENCES products(id)
            ON DELETE CASCADE
);

-- +goose Down
DROP TABLE products_images;

DROP TABLE products;
