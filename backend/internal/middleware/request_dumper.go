package middleware

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
)

// RequestDumper logs the full HTTP request, including headers and body.
func RequestDumper(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Dump the request
		requestDump, err := httputil.DumpRequest(r, true)
		if err != nil {
			log.Printf("Error dumping request: %v", err)
		} else {
			log.Printf("\n--- Incoming Request ---\n%s\n------------------------\n", requestDump)
		}

		// If the request body was read by DumpRequest, it needs to be put back
		// for subsequent handlers to read it.
		r.Body = io.NopCloser(bytes.NewBuffer(requestDump))

		next.ServeHTTP(w, r)
	})
}
