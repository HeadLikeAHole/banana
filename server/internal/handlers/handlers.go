package handlers

import (
	"github.com/HeadLikeAHole/banana/server/internal/helpers"
	"github.com/HeadLikeAHole/banana/server/internal/types"
	"github.com/go-playground/form"
	"github.com/go-playground/validator/v10"
)

var (
	app         *types.AppConfig
	validate    *validator.Validate
	formDecoder *form.Decoder
)

func NewHandlers(a *types.AppConfig) {
	app = a
	validate = validator.New(validator.WithRequiredStructEnabled())
	_ = validate.RegisterValidation("email_is_unique", helpers.EmailIsUnique)
	formDecoder = form.NewDecoder()
}
