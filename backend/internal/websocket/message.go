// file: internal/websocket/message.go
package websocket

// Generic Message structure
type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

// Payload for location updates from the client
type UpdateLocationPayload struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

// Payload for broadcasting all user locations from the server
type AllUsersLocationsPayload struct {
	Users []UserLocation `json:"users"`
}

type UserLocation struct {
	UserID string  `json:"user_id"`
	Lat    float64 `json:"lat"`
	Lng    float64 `json:"lng"`
}
