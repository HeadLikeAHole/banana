package types

type ProductCreateReq struct {
	Title       string  `form:"title" validate:"required"`
	Description string  `form:"description" validate:"required"`
	Price       float64 `form:"price" validate:"required,numeric"`
}
