export interface Location {
    id: number;
    name: string;
    type: "hospital" | "police" | "mall" | "transport" | "government" | "meeting" | "education";
    address: string;
    icon: string;
    safetyRating: "Very Safe" | "Safe" | "Caution";
}

export interface Route {
    id: string;
    name: string;
    duration: string;
    description: string;
    warning?: string;
    type: "safe" | "fast";
}

export type SearchMode = "map" | "search";
