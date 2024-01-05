package main

import (
	"database/sql"
	"errors"
	"github.com/HeadLikeAHole/banana/server/internal/db"
	"github.com/HeadLikeAHole/banana/server/internal/email"
	"github.com/HeadLikeAHole/banana/server/internal/handlers"
	"github.com/HeadLikeAHole/banana/server/internal/helpers"
	"github.com/HeadLikeAHole/banana/server/internal/middleware"
	"github.com/HeadLikeAHole/banana/server/internal/tx"
	"github.com/HeadLikeAHole/banana/server/internal/types"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func setup() error {
	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stdout, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	app = &types.AppConfig{
		ServerURL: serverURL,
		InfoLog:   infoLog,
		ErrorLog:  errorLog,
	}

	err := godotenv.Load()
	if err != nil {
		return err
	}

	app.InfoLog.Println("Connecting to database...")
	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		return errors.New("DB URL was not found in the environment")
	}
	dbConn, err := sql.Open("mysql", dbURL)
	if err != nil {
		return err
	}
	app.DB = dbConn
	app.Queries = db.New(dbConn)

	app.InfoLog.Println("Starting email dispatcher...")
	emailServerSettings := types.EmailServerSettings{
		Host:     os.Getenv("EMAIL_SERVER_HOST"),
		Port:     os.Getenv("EMAIL_SERVER_PORT"),
		Username: os.Getenv("EMAIL_SERVER_USERNAME"),
		Password: os.Getenv("EMAIL_SERVER_PASSWORD"),
	}
	emailQueue := make(chan types.Email, maxEmailQueueSize)
	app.EmailQueue = emailQueue
	dispatcher := email.NewDispatcher(app, emailServerSettings, maxWorkerPoolSize)
	dispatcher.Run()

	handlers.NewHandlers(app)
	helpers.NewHelpers(app)
	middleware.NewMiddleware(app)
	tx.NewTX(app)

	return nil
}
