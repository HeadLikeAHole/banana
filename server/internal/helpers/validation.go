package helpers

import (
	"context"
	"fmt"
	"github.com/go-playground/validator/v10"
	"regexp"
	"strings"
)

func GetValidationErrors(errs error) map[string]string {
	validationErrors := make(map[string]string)

	for _, err := range errs.(validator.ValidationErrors) {
		fieldName, fieldError := createCustomFieldError(err)
		validationErrors[fieldName] = fieldError
	}

	return validationErrors
}

func createCustomFieldError(fe validator.FieldError) (string, string) {
	tagsErrors := map[string]string{
		"required":        "This field is required",
		"email":           "Invalid email",
		"min":             fmt.Sprintf("Field should contain minimum %s characters", fe.Param()),
		"eqfield":         "Fields don't match",
		"email_is_unique": "This email already exists",
	}

	// converts struct field name to json field name
	fieldName := ToSnakeCase(fe.Field())
	// extracts error by tag
	fieldError := tagsErrors[fe.Tag()]

	return fieldName, fieldError
}

func ToSnakeCase(str string) string {
	matchAllCaps := regexp.MustCompile("([a-z0-9])([A-Z])")
	underscoreStr := matchAllCaps.ReplaceAllString(str, "${1}_${2}")
	return strings.ToLower(underscoreStr)
}

func EmailIsUnique(fl validator.FieldLevel) bool {
	_, err := app.Queries.GetUserByEmail(context.Background(), fl.Field().String())
	if err == nil {
		return false
	}

	return true
}
