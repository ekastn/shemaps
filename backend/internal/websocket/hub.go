// file: internal/websocket/hub.go
package websocket

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/google/uuid"
)

// Hub maintains the set of active clients and broadcasts messages to the clients
type Hub struct {
	clients    map[uuid.UUID]*Client
	clientsMux sync.RWMutex

	Broadcast chan *Client

	Register   chan *Client
	Unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan *Client),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		clients:    make(map[uuid.UUID]*Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.clientsMux.Lock()
			h.clients[client.DeviceID] = client
			h.clientsMux.Unlock()
			log.Printf("Client connected: %s", client.Conn.RemoteAddr())
			h.BroadcastState()
		case client := <-h.Unregister:
			h.clientsMux.Lock()
			if _, ok := h.clients[client.DeviceID]; ok {
				delete(h.clients, client.DeviceID)
				close(client.Send)
				log.Printf("Client disconnected: %s", client.Conn.RemoteAddr())
			}
			h.clientsMux.Unlock()
			h.BroadcastState()
		case <-h.Broadcast:
			h.clientsMux.RLock()
			h.BroadcastState()
			h.clientsMux.RUnlock()
		}
	}
}

func (h *Hub) BroadcastState() {
	h.clientsMux.RLock()
	defer h.clientsMux.RUnlock()

	locations := h.GetAllUserLocations()
	payload := AllUsersLocationsPayload{Users: locations}
	message := Message{Type: AllUsersLocations, Payload: payload}

	msgBytes, err := json.Marshal(message)
	if err != nil {
		log.Printf("error marshalling locations: %v", err)
		return
	}

	for _, client := range h.clients {
		select {
		case client.Send <- msgBytes:
		default:
			log.Printf("Client send buffer full, skipping: %s", client.DeviceID)
		}
	}
}

func (h *Hub) GetAllUserLocations() []UserLocation {
	var locations []UserLocation
	for _, client := range h.clients {
		locations = append(locations, UserLocation{
			DeviceID:  client.DeviceID.String(),
			Lat:       client.LastLat,
			Lng:       client.LastLng,
			IsInPanic: client.IsInPanic,
		})
	}
	return locations
}
