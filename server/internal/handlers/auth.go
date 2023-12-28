package handlers

import (
	"database/sql"
	"fmt"
	"github.com/HeadLikeAHole/banana/server/internal/db"
	"github.com/HeadLikeAHole/banana/server/internal/helpers"
	"github.com/HeadLikeAHole/banana/server/internal/types"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

func SignUp(w http.ResponseWriter, r *http.Request) {
	var data types.UserSignUpReq

	err := helpers.ReadJSON(w, r, &data)
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

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(data.Password), 12)
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Server error"})
		app.ErrorLog.Println(err)
		return
	}

	randomString := helpers.RandomString(30)
	activationToken, err := bcrypt.GenerateFromPassword([]byte(randomString), 12)
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Server error"})
		app.ErrorLog.Println(err)
		return
	}

	_, err = app.Queries.CreateUser(r.Context(), db.CreateUserParams{
		Email:    data.Email,
		Password: string(hashedPassword),
		ActivationToken: sql.NullString{
			String: string(activationToken),
			Valid:  true,
		},
		ActivationExpiration: sql.NullTime{
			Time:  time.Now().Add(time.Hour),
			Valid: true,
		},
	})
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Database error"})
		app.ErrorLog.Println(err)
		return
	}

	app.EmailQueue <- types.Email{
		FromAddress: "igorwho@yandex.ru",
		ToAddress:   data.Email,
		Subject:     "Account Activation Link",
		Template: types.EmailTemplate{
			Intros: []string{
				"Welcome to Banana! We're very excited to have you with us.",
			},
			Instructions: "To start using your account, please click here:",
			ButtonText:   "Confirm your account",
			ButtonLink:   fmt.Sprintf("%s/activate-account?token=%s", app.ServerURL, activationToken),
			Outros: []string{
				"Need help, or have questions? Just reply to this email, we'd love to help.",
			},
		},
	}

	helpers.WriteJSON(w, http.StatusCreated, types.M{"message": "We've sent you an account activation email"})
}

func ActivateAccount(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")

	user, err := app.Queries.GetUserByActivationToken(r.Context(), sql.NullString{
		String: token,
		Valid:  true,
	})
	if err != nil {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": "Invalid activation token"})
		return
	}

	if user.ActivationExpiration.Time.Before(time.Now()) {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": "Activation token has expired"})
		return
	}

	err = app.Queries.ActivateUser(r.Context(), sql.NullString{
		String: token,
		Valid:  true,
	})
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Database error"})
		app.ErrorLog.Println(err)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, types.M{
		"message": "Account has been successfully activated. Now you can sign in.",
	})
}

func SignIn(w http.ResponseWriter, r *http.Request) {
	var data types.UserSignInReq

	err := helpers.ReadJSON(w, r, &data)
	if err != nil {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": err.Error()})
		return
	}

	user, err := app.Queries.GetUserByEmail(r.Context(), data.Email)
	if err != nil {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": "Invalid credentials"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.Password))
	if err != nil {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": "Invalid credentials"})
		return
	}

	if user.IsActive == 0 {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": "Inactive account"})
		return
	}

	token, err := helpers.GenerateJWT(user.ID)
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Server error"})
		app.ErrorLog.Println(err)
		return
	}

	userRes := types.UserRes{
		ID:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName.String,
		LastName:  user.LastName.String,
	}

	helpers.WriteJSON(w, http.StatusCreated, types.M{
		"message": "You have successfully signed in",
		"data": types.UserSignInRes{
			Token: token,
			User:  userRes,
		},
	})
}

func User(w http.ResponseWriter, r *http.Request) {
	// https://stackoverflow.com/questions/55436628/json-decoded-value-is-treated-as-float64-instead-of-int
	userID, ok := r.Context().Value("userID").(float64)
	if !ok {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": "An error occurred retrieving user"})
		return
	}

	user, err := app.Queries.GetUserByID(r.Context(), int64(userID))
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Server error"})
		app.ErrorLog.Println(err)
		return
	}

	userRes := types.UserRes{
		ID:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName.String,
		LastName:  user.LastName.String,
	}

	helpers.WriteJSON(w, http.StatusOK, types.M{
		"message": "User successfully retrieved",
		"data":    userRes,
	})
}

func RequestPasswordReset(w http.ResponseWriter, r *http.Request) {
	var data types.RequestPasswordResetReq

	err := helpers.ReadJSON(w, r, &data)
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

	_, err = app.Queries.GetUserByEmail(r.Context(), data.Email)
	if err != nil {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": "Email doesn't exist"})
		return
	}

	randomString := helpers.RandomString(30)
	passwordResetToken, err := bcrypt.GenerateFromPassword([]byte(randomString), 12)
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Server error"})
		app.ErrorLog.Println(err)
		return
	}

	err = app.Queries.SetPasswordResetToken(r.Context(), db.SetPasswordResetTokenParams{
		PasswordResetToken: sql.NullString{
			String: string(passwordResetToken),
			Valid:  true,
		},
		PasswordResetExpiration: sql.NullTime{
			Time:  time.Now().Add(time.Hour),
			Valid: true,
		},
		Email: data.Email,
	})
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Database error"})
		app.ErrorLog.Println(err)
		return
	}

	app.EmailQueue <- types.Email{
		FromAddress: "igorwho@yandex.ru",
		ToAddress:   data.Email,
		Subject:     "Password Reset Link",
		Template: types.EmailTemplate{
			Instructions: "To start the process of resetting your password, please click here:",
			ButtonText:   "Reset your password",
			ButtonLink:   fmt.Sprintf("%s/reset-password?token=%s", app.ServerURL, passwordResetToken),
			Outros: []string{
				"Need help, or have questions? Just reply to this email, we'd love to help.",
			},
		},
	}

	helpers.WriteJSON(w, http.StatusOK, types.M{"message": "We've sent you a password reset email"})
}

func ResetPassword(w http.ResponseWriter, r *http.Request) {
	var data types.ResetPasswordReq

	err := helpers.ReadJSON(w, r, &data)
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

	user, err := app.Queries.GetUserByPasswordResetToken(r.Context(), sql.NullString{
		String: data.Token,
		Valid:  true,
	})
	if err != nil {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": "Invalid password reset token"})
		return
	}

	if user.PasswordResetExpiration.Time.Before(time.Now()) {
		helpers.WriteJSON(w, http.StatusBadRequest, types.M{"message": "Password reset token has expired"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(data.Password), 12)
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Server error"})
		app.ErrorLog.Println(err)
		return
	}

	err = app.Queries.SetUserPassword(r.Context(), db.SetUserPasswordParams{
		Password: string(hashedPassword),
		PasswordResetToken: sql.NullString{
			String: data.Token,
			Valid:  true,
		},
	})
	if err != nil {
		helpers.WriteJSON(w, http.StatusInternalServerError, types.M{"message": "Database error"})
		app.ErrorLog.Println(err)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, types.M{
		"message": "New password has been set. Now you can sign in using it.",
	})
}
