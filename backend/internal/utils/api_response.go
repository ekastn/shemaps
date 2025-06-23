package utils

import (
	"encoding/json"
	"log"
	"net/http"
)

type ApiResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *string     `json:"error,omitempty"`
}

func Success(w http.ResponseWriter, statusCode int, data interface{}) {
	if data == nil {
		data = struct{}{}
	}
	respondWithJSON(w, statusCode, ApiResponse{
		Success: true,
		Data:    data,
	})
}

func Error(w http.ResponseWriter, statusCode int, status string, message string) {
	msg := message
	respondWithJSON(w, statusCode, ApiResponse{
		Success: false,
		Error:   &msg,
	})
}

func respondWithJSON(w http.ResponseWriter, statusCode int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Printf("Error encoding JSON response: %v", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
