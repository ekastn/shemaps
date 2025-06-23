package handlers

import (
	"net/http"
	"github.com/ekastn/shemaps/backend/internal/utils"
)

type HealthHandler struct{}

func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

func (h *HealthHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	utils.Success(w, http.StatusOK, map[string]string{"status": "ok"})
}
