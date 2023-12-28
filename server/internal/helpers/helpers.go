package helpers

import (
	"errors"
	"github.com/HeadLikeAHole/banana/server/internal/types"
	"github.com/golang-jwt/jwt/v5"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

var (
	app *types.AppConfig
	src = rand.NewSource(time.Now().UnixNano())
)

const (
	letterBytes     = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	letterIndexBits = 6                      // 6 bits to represent a letter index
	letterIndexMask = 1<<letterIndexBits - 1 // all 1-bits, as many as letterIdxBits
	letterIndexMax  = 63 / letterIndexBits   // of letter indices fitting in 63 bits
)

func NewHelpers(a *types.AppConfig) {
	app = a
}

func RandomString(length int) string {
	b := make([]byte, length)

	for i, cache, remain := length-1, src.Int63(), letterIndexMax; i >= 0; {
		if remain == 0 {
			cache, remain = src.Int63(), letterIndexMax
		}
		if index := int(cache & letterIndexMask); index < len(letterBytes) {
			b[i] = letterBytes[index]
			i--
		}
		cache >>= letterIndexBits
		remain--
	}

	return string(b)
}

func IsAuthenticated(r *http.Request) (jwt.MapClaims, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return jwt.MapClaims{}, errors.New("Request doesn't contain authorization header")
	}

	headerSlice := strings.Split(authHeader, " ")
	if headerSlice[0] != "Bearer" {
		return jwt.MapClaims{}, errors.New("Malformed authorization header")
	}

	claims, err := ParseAndValidateJWT(headerSlice[1])
	if err != nil {
		return jwt.MapClaims{}, err
	}

	return claims, nil
}
