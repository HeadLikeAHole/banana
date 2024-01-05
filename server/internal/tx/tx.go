package tx

import (
	"github.com/HeadLikeAHole/banana/server/internal/types"
)

var (
	app *types.AppConfig
)

func NewTX(a *types.AppConfig) {
	app = a
}
