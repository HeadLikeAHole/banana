package types

type UserRes struct {
	ID        int64  `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type UserSignUpReq struct {
	Email           string `json:"email" validate:"required,email,email_is_unique"`
	Password        string `json:"password" validate:"required,min=2,eqfield=ConfirmPassword"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=2"`
}

type UserSignInReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserSignInRes struct {
	Token string  `json:"token"`
	User  UserRes `json:"user"`
}

type RequestPasswordResetReq struct {
	Email string `json:"email" validate:"required,email"`
}

type ResetPasswordReq struct {
	Token           string `json:"token"`
	Password        string `json:"password" validate:"required,min=2,eqfield=ConfirmPassword"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=2"`
}
