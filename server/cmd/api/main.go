package main

import (
	"fmt"
	"github.com/HeadLikeAHole/banana/server/internal/types"
	"net/http"
)

const (
	serverURL         = "http://localhost:3000"
	port              = "8000"
	maxEmailQueueSize = 5
	maxWorkerPoolSize = 5
)

var (
	app *types.AppConfig
)

func main() {
	err := setup()
	if err != nil {
		app.ErrorLog.Fatal(err)
	}

	app.InfoLog.Println("Server running on port:", port)
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), routes())
	if err != nil {
		app.ErrorLog.Fatal(err)
	}
}
