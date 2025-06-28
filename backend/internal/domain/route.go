package domain

import "googlemaps.github.io/maps"

type SafetyLevel string

const (
	LevelSafe      SafetyLevel = "SAFE"
	LevelCautious  SafetyLevel = "CAUTIOUS"
	LevelDangerous SafetyLevel = "DANGEROUS"
)

type RouteWithSafety struct {
	maps.Route
	SafetyLevel SafetyLevel `json:"safety_level"`
	DangerScore int         `json:"danger_score"`
}
