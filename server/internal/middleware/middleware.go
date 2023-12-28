package middleware

import (
	"context"
	"github.com/HeadLikeAHole/banana/server/internal/helpers"
	"github.com/HeadLikeAHole/banana/server/internal/types"
	"net/http"
)

var app *types.AppConfig

func NewMiddleware(a *types.AppConfig) {
	app = a
}

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, err := helpers.IsAuthenticated(r)
		if err != nil {
			helpers.WriteJSON(w, http.StatusUnauthorized, types.M{"message": err.Error()}, nil)
			return
		}

		userID, ok := claims["sub"]
		if !ok {
			app.ErrorLog.Println("Claims don't contain user ID")
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, "userID", userID)
		r = r.WithContext(ctx)

		w.Header().Add("Cache-Control", "no-store")

		next.ServeHTTP(w, r)
	})
}
