export interface Location {
    id: number;
    name: string;
    address: string;
    coordinate?: Coordinate; // Add coordinates for custom pin locations
    placeId?: string; // Google Maps Place ID
}

export interface PlaceResult {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
    types?: string[];
}

export interface Route {
    id: string;
    name: string;
    duration: string;
    description: string;
    warning?: string;
    type: "safe" | "fast";
}

export type SearchMode = "search" | "pin";

export type AppMode = "map" | SearchMode | "placeInfo";

export interface Coordinate {
    lat: number;
    lng: number;
    title?: string;
}

export interface SafetyReport {
    id: string;
    reporter_user_id: string;
    latitude: number;
    longitude: number;
    safety_level: "DANGEROUS" | "CAUTIOUS" | "SAFE";
    tags: string[];
    description?: string;
    confirmations_count: number;
    created_at: string;
}

export interface RouteWithSafety extends google.maps.DirectionsRoute {
    safety_level: "DANGEROUS" | "CAUTIOUS" | "SAFE";
    danger_score: number;
}

export interface EmergencyContact {
    id: string;
    user_id: string;
    contact_name: string;
    phone_number: string;
    created_at: string;
}

export interface UserLocation {
    device_id: string;
    lat: number;
    lng: number;
    is_in_panic: boolean;
}
