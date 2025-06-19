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
