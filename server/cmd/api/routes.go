package main

import (
	"github.com/HeadLikeAHole/banana/server/internal/handlers"
	"github.com/HeadLikeAHole/banana/server/internal/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"html/template"
	"net/http"
)

func routes() http.Handler {
	r := chi.NewRouter()

	// Basic CORS
	// for more ideas, see: https://developer.github.com/v3/#cross-origin-resource-sharing
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Mount("/", indexRouter())
	r.Mount("/api", apiRouter())

	return r
}

// serves react app
func indexRouter() http.Handler {
	r := chi.NewRouter()

	r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		tmpl := template.Must(template.ParseFiles("./static/index.html"))
		err := tmpl.Execute(w, nil)
		if err != nil {
			app.ErrorLog.Println(err)
		}
	})

	fs := http.FileServer(http.Dir("./static"))
	r.Handle("/static/*", http.StripPrefix("/static/", fs))

	return r
}

func apiRouter() http.Handler {
	r := chi.NewRouter()

	r.Route("/auth", func(r chi.Router) {
		r.Post("/sign-up", handlers.SignUp)
		r.Get("/activate-account", handlers.ActivateAccount)
		r.Post("/sign-in", handlers.SignIn)
		r.With(middleware.Auth).Post("/user", handlers.User)
		r.Post("/request-password-reset", handlers.RequestPasswordReset)
		r.Post("/reset-password", handlers.ResetPassword)
	})

	r.Route("/products", func(r chi.Router) {
		r.Post("/", handlers.CreateProduct)
	})

	return r
}
