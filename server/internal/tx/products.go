package tx

import (
	"context"
	"fmt"
	"github.com/HeadLikeAHole/banana/server/internal/db"
	"github.com/HeadLikeAHole/banana/server/internal/helpers"
	"mime/multipart"
)

func CreateProduct(ctx context.Context, product db.CreateProductParams, files []*multipart.FileHeader) (int64, error) {
	tx, err := app.DB.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	qtx := app.Queries.WithTx(tx)

	result, err := qtx.CreateProduct(ctx, product)
	if err != nil {
		return 0, err
	}

	productID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	for _, fileHeader := range files {
		// todo check if filename exists
		_, err = qtx.CreateProductImage(ctx, db.CreateProductImageParams{
			ProductID: productID,
			Path:      fmt.Sprintf("/static/images/products/%d/%s", productID, fileHeader.Filename),
		})
		if err != nil {
			return 0, err
		}

		err = helpers.SaveFile(fileHeader, productID)
		if err != nil {
			return 0, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return 0, err
	}

	return productID, nil
}

func GetProductByID(ctx context.Context, productID int64) (db.Product, []db.ProductImage, error) {
	tx, err := app.DB.Begin()
	if err != nil {
		return db.Product{}, nil, err
	}
	defer tx.Rollback()

	qtx := app.Queries.WithTx(tx)

	product, err := qtx.GetProductByID(ctx, productID)
	if err != nil {
		return db.Product{}, nil, err
	}

	images, err := qtx.GetProductImages(ctx, productID)
	if err != nil {
		return db.Product{}, nil, err
	}

	return product, images, nil
}
