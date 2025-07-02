// file: internal/websocket/message.go
package websocket

const (
	// Message types
	UpdateLocation          = "update_location"
	AllUsersLocations       = "all_users_locations"
	UserDisconnected        = "user_disconnected"
	MessageTypeTriggerPanic = "trigger_panic"
)

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
	DeviceID  string  `json:"device_id"`
	Lat       float64 `json:"lat"`
	Lng       float64 `json:"lng"`
	IsInPanic bool    `json:"is_in_panic"`
}
