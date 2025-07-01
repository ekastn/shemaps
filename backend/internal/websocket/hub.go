// file: internal/websocket/hub.go
package websocket

import (
	"encoding/json"
	"log"
)

// Hub maintains the set of active clients and broadcasts messages to the clients
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	Broadcast chan *Client

	// Register requests from the clients.
	Register chan *Client

	// Unregister requests from clients.
	Unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan *Client),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.clients[client] = true
			log.Printf("Client connected: %s", client.Conn.RemoteAddr())
			h.broadcastLocations()
		case client := <-h.Unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
				log.Printf("Client disconnected: %s", client.Conn.RemoteAddr())
				h.broadcastLocations()
			}
		case <-h.Broadcast:
			h.broadcastLocations()
		}
	}
}

func (h *Hub) broadcastLocations() {
	locations := h.GetAllUserLocations()
	payload := AllUsersLocationsPayload{Users: locations}
	message := Message{Type: AllUsersLocations, Payload: payload}

	msgBytes, err := json.Marshal(message)
	if err != nil {
		log.Printf("error marshalling locations: %v", err)
		return
	}

	for client := range h.clients {
		select {
		case client.Send <- msgBytes:
		default:
			close(client.Send)
			delete(h.clients, client)
		}
	}
}

func (h *Hub) GetAllUserLocations() []UserLocation {
	var locations []UserLocation
	for client := range h.clients {
		if client.Location != nil {
			locations = append(locations, *client.Location)
		}
	}
	return locations
}
