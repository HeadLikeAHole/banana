package handlers

import (
	"github.com/HeadLikeAHole/banana/server/internal/db"
	"github.com/HeadLikeAHole/banana/server/internal/helpers"
	"github.com/HeadLikeAHole/banana/server/internal/tx"
	"github.com/HeadLikeAHole/banana/server/internal/types"
	"net/http"
)

func CreateProduct(w http.ResponseWriter, r *http.Request) {
	var data types.ProductCreateReq

	userID, ok := r.Context().Value("userID").(float64)
	if !ok {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": "An error occurred retrieving user"})
		return
	}

	if err := r.ParseMultipartForm(32 << 20); err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Server error"})
		app.ErrorLog.Println(err)
		return
	}

	err := formDecoder.Decode(&data, r.MultipartForm.Value)
	if err != nil {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": err.Error()})
		return
	}

	err = validate.Struct(data)
	if err != nil {
		errs := helpers.GetValidationErrors(err)
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{
			"message": "Validation error",
			"errors":  errs,
		})
		return
	}

	_, err = tx.CreateProduct(r.Context(), db.CreateProductParams{
		UserID:      int64(userID),
		Title:       data.Title,
		Description: data.Description,
		Price:       int32(data.Price),
	}, r.MultipartForm.File["images"])
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Server error"})
		app.ErrorLog.Println(err)
		return
	}

	helpers.WriteJSON(w, http.StatusCreated, types.M{"message": "Success"})
}
