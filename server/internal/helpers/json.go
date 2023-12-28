package helpers

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
)

func ReadJSON(w http.ResponseWriter, r *http.Request, data any) error {
	maxBytes := 1048576 // one megabyte
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(data)
	if err != nil {
		return err
	}

	err = decoder.Decode(&struct{}{})
	if err != io.EOF {
		return errors.New("body must have a single JSON value")
	}

	return nil
}

func WriteJSON(w http.ResponseWriter, code int, data any, headers ...http.Header) {
	w.WriteHeader(code)
	w.Header().Set("Content-Type", "application/json")
	if len(headers) > 0 {
		for key, value := range headers[0] {
			w.Header()[key] = value
		}
	}

	encoder := json.NewEncoder(w)
	if err := encoder.Encode(data); err != nil {
		log.Printf("could not encode error: %v", err)
	}
}
