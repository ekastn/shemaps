import { useState, useEffect, useCallback } from "react";
import type { Location, Coordinate } from "@/lib/types";
import { getRecentLocations } from "@/services/locationService";

export const useLocationManager = (initialLocation?: Coordinate) => {
    const [recentSearches, setRecentSearches] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [currentCoordinate, setCurrentCoordinate] = useState<Coordinate>(
        initialLocation || { lat: -6.2088, lng: 106.8456 } // Default to Jakarta
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecentSearches = async () => {
            try {
                const results = await getRecentLocations();
                setRecentSearches(results);
            } catch (err) {
                console.error("Failed to fetch recent searches:", err);
                setError("Failed to load recent searches");
            }
        };
        fetchRecentSearches();
    }, []);

    const addToRecentSearches = useCallback((location: Location) => {
        setRecentSearches(prev => {
            if (prev.some(item => item.id === location.id)) {
                return prev;
            }
            return [location, ...prev].slice(0, 5); // Limit to 5 recent searches
        });
    }, []);

    return {
        recentSearches,
        selectedLocation,
        setSelectedLocation,
        currentCoordinate,
        setCurrentCoordinate,
        error,
        addToRecentSearches,
    };
};
