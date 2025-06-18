export interface Location {
    id: number;
    name: string;
    type: "hospital" | "police" | "mall" | "transport" | "government" | "meeting" | "education" | "custom";
    address: string;
    icon: string;
    safetyRating: "Very Safe" | "Safe" | "Caution";
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

export type SearchMode = "map" | "search" | "pin";

export interface Coordinate {
    lat: number;
    lng: number;
}
