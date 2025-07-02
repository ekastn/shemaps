// file: internal/handlers/websocket_handler.go
package handlers

import (
	"log"
	"net/http"

	custommiddleware "github.com/ekastn/shemaps/backend/internal/middleware"
	"github.com/ekastn/shemaps/backend/internal/utils"
	"github.com/ekastn/shemaps/backend/internal/websocket"
	"github.com/google/uuid"
	gorilla_websocket "github.com/gorilla/websocket"
)

var upgrader = gorilla_websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Allow all origins for development
		return true
	},
}

type WebSocketHandler struct {
	Hub *websocket.Hub
}

func NewWebSocketHandler(hub *websocket.Hub) *WebSocketHandler {
	return &WebSocketHandler{Hub: hub}
}

func (h *WebSocketHandler) ServeWs(w http.ResponseWriter, r *http.Request) {
	deviceID, ok := custommiddleware.GetDeviceIDFromContext(r.Context())
	if !ok {
		log.Println("Could not get deviceID from context before upgrade")
		utils.Error(w, http.StatusUnauthorized, "Unauthorized", "Missing or invalid device ID")
		return
	}

	parsedDeviceID, ok := deviceID.(uuid.UUID)
	if !ok {
		utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to parse device ID")
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := websocket.NewClient(h.Hub, conn, parsedDeviceID)

	h.Hub.Register <- client

	go client.WritePump()
	go client.ReadPump()
}
