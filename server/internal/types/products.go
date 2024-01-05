package types

import "github.com/HeadLikeAHole/banana/server/internal/db"

type ProductCreateReq struct {
	Title       string  `form:"title" validate:"required"`
	Description string  `form:"description" validate:"required"`
	Price       float64 `form:"price" validate:"required,numeric"`
}

type ProductCreateRes struct {
	ID int64 `json:"id"`
}

type ProductRes struct {
	db.Product
	Images []db.ProductImage `json:"images"`
}
