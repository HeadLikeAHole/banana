package helpers

import (
	"github.com/golang-jwt/jwt/v5"
	"os"
	"time"
)

var (
	secretKey      = os.Getenv("JWT_SECRET_KEY")
	expirationTime = time.Now().Add(time.Hour * 24).Unix()
)

func GenerateJWT(id int64) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": id,
		"exp": expirationTime,
	})

	return token.SignedString([]byte(secretKey))
}

func ParseAndValidateJWT(tokenString string) (jwt.MapClaims, error) {
	claims := jwt.MapClaims{}

	_, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return jwt.MapClaims{}, err
	}

	return claims, nil
}
