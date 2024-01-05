package tx

import (
	"context"
	"fmt"
	"github.com/HeadLikeAHole/banana/server/internal/db"
	"github.com/HeadLikeAHole/banana/server/internal/helpers"
	"mime/multipart"
)

func CreateProduct(
	ctx context.Context,
	product db.CreateProductParams,
	files []*multipart.FileHeader,
) (db.Product, error) {
	tx, err := app.DB.Begin()
	if err != nil {
		return db.Product{}, err
	}
	defer tx.Rollback()

	qtx := app.Queries.WithTx(tx)

	result, err := qtx.CreateProduct(ctx, product)
	if err != nil {
		return db.Product{}, err
	}

	productID, err := result.LastInsertId()
	if err != nil {
		return db.Product{}, err
	}

	for _, fileHeader := range files {
		result, err = qtx.CreateProductImage(ctx, db.CreateProductImageParams{
			ProductID: productID,
			Path:      fmt.Sprintf("/static/images/products/%d/%s", productID, fileHeader.Filename),
		})
		if err != nil {
			return db.Product{}, err
		}

		err = helpers.SaveFile(fileHeader, productID)
		if err != nil {
			return db.Product{}, err
		}
	}

	err = tx.Commit()

	return db.Product{}, nil
}
