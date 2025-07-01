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
	userID, ok := custommiddleware.GetUserIDFromContext(r.Context())
	if !ok {
		log.Println("Could not get userID from context before upgrade") // More specific log
		// It's crucial to return here if authentication failed
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	parsedUserID, ok := userID.(uuid.UUID)
	if !ok {
		utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to parse user ID")
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &websocket.Client{Hub: h.Hub, Conn: conn, Send: make(chan []byte, 256), UserID: parsedUserID}

	if client.Hub == nil {
		log.Println("ServeWs: client.Hub is nil")
		http.Error(w, "Internal Server Error: Hub not initialized", http.StatusInternalServerError)
		return
	}

	if client.Hub.Register == nil {
		log.Println("ServeWs: client.Hub.Register channel is nil")
		http.Error(w, "Internal Server Error: Hub Register channel not initialized", http.StatusInternalServerError)
		return
	}

	client.Hub.Register <- client

	go client.WritePump()
	go client.ReadPump()
}
