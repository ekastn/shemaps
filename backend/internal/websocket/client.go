package websocket

import (
	"bytes"
	"encoding/json"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

var (
	newline = []byte{10}
	space   = []byte{32}
)

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	Hub *Hub

	Conn *websocket.Conn

	Send chan []byte

	DeviceID uuid.UUID
	Location *UserLocation
}

// ReadPump pumps messages from the websocket connection to the hub.
func (c *Client) ReadPump() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()
	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error { c.Conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))

		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("error decoding message: %v", err)
			continue
		}

		switch msg.Type {
		case UpdateLocation:
			payloadBytes, err := json.Marshal(msg.Payload)
			if err != nil {
				log.Printf("error marshalling payload: %v", err)
				continue
			}
			var loc UpdateLocationPayload
			if err := json.Unmarshal(payloadBytes, &loc); err != nil {
				log.Printf("error unmarshalling location payload: %v", err)
				continue
			}
			c.Location = &UserLocation{
				DeviceID: c.DeviceID.String(),
				Lat:    loc.Lat,
				Lng:    loc.Lng,
			}
			c.Hub.Broadcast <- c
		}
	}
}

// writePump pumps messages from the hub to the websocket connection.
func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
