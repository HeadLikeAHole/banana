package types

import (
	"github.com/HeadLikeAHole/banana/server/internal/db"
	"log"
)

type AppConfig struct {
	ServerURL  string
	InfoLog    *log.Logger
	ErrorLog   *log.Logger
	Queries    *db.Queries
	EmailQueue chan Email
}

// M is a shortcut for map[string]any, useful for JSON returns
type M map[string]any
