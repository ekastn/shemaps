import { useState, useCallback, useEffect, useRef } from "react";
import type { Location, Coordinate, AppMode } from "@/lib/types";
import {
    getRecentLocations,
} from "@/services/locationService";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

export const useSearch = () => {
    const [appMode, setAppMode] = useState<AppMode>("map");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [recentSearches, setRecentSearches] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentCoordinate, setCurrentCoordinate] = useState<Coordinate>({ lat: -6.2088, lng: 106.8456 }); // Default to Jakarta
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<Location[]>([]);
    const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

    // Use the useMapsLibrary hook to ensure the Places library is loaded
    const placesLib = useMapsLibrary("places");
    const map = useMap();

    useEffect(() => {
        if (!placesLib && !map) return;

        if (!autocompleteServiceRef.current) {
            autocompleteServiceRef.current = new placesLib.AutocompleteService();
        }
    }, [placesLib]);

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

    // Fetch autocomplete suggestions from Google Maps API
    useEffect(() => {
        if (!autocompleteServiceRef.current || !searchQuery.trim()) {
            setFilteredSuggestions([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        autocompleteServiceRef.current.getPlacePredictions({
            input: searchQuery
        }, (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
                setFilteredSuggestions([]);
                setIsLoading(false);
                return;
            }
            const locations: Location[] = predictions.map((suggestion, index) => ({
                id: index, // Always use a number for id
                name: suggestion.structured_formatting.main_text,
                address: suggestion.structured_formatting?.secondary_text || "",
                placeId: suggestion.place_id
            }));
            setFilteredSuggestions(locations);
            setIsLoading(false);
        });
    }, [searchQuery]);

    const enterSearchMode = useCallback(() => {
        setAppMode("search");
    }, []);

    const exitSearchMode = useCallback(() => {
        setAppMode("map");
    }, []);

    const enterPinMode = useCallback(() => {
        setAppMode("pin");
    }, []);

    const exitPinMode = useCallback(() => {
        setAppMode("search");
    }, []);
    
    const enterPlaceInfo = useCallback(() => {
        setAppMode("placeInfo");
    }, []);
    
    const exitPlaceInfo = useCallback(() => {
        setAppMode("map");
        setSearchQuery("");
        setFilteredSuggestions([]);
        setSelectedLocation(null);
    }, []);

    // Helper to get coordinates from placeId
    const getCoordinatesFromPlaceId = async (placeId: string): Promise<Coordinate | null> => {
        return new Promise((resolve) => {
            if (!window.google || !window.google.maps) return resolve(null);
            if (!placesServiceRef.current) {
                // Create a dummy div for PlacesService
                const dummyDiv = document.createElement("div");
                placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDiv);
            }
            placesServiceRef.current!.getDetails({ placeId }, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
                    resolve({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                } else {
                    resolve(null);
                }
            });
        });
    };

    const selectLocation = useCallback(
        async (location: Location) => {
            // Create a new location object to ensure we have the coordinate
            const locationWithCoord = { ...location };
            
            // If we don't have coordinates but have a placeId, fetch them
            if ((!location.coordinate || !location.coordinate.lat || !location.coordinate.lng) && location.placeId) {
                try {
                    const coords = await getCoordinatesFromPlaceId(location.placeId);
                    if (coords) {
                        locationWithCoord.coordinate = coords;
                    }
                } catch (err) {
                    console.error("Failed to get coordinates for place:", err);
                }
            }

            // If we still don't have coordinates, use the current map center as fallback
            if (!locationWithCoord.coordinate) {
                locationWithCoord.coordinate = {
                    lat: currentCoordinate.lat,
                    lng: currentCoordinate.lng,
                    title: location.name
                };
            }

            setSelectedLocation(locationWithCoord);
            setSearchQuery(location.name);
            setAppMode("placeInfo");
            setFilteredSuggestions([]);

            // Update map view
            if (map && map.panTo && locationWithCoord.coordinate) {
                map.panTo(locationWithCoord.coordinate);
                setCurrentCoordinate(locationWithCoord.coordinate);
            }

            // Add to recent searches if not already there
            setRecentSearches((prev) => {
                if (prev.some(item => item.id === location.id)) {
                    return prev;
                }
                return [location, ...prev].slice(0, 5); // Limit to 5 recent searches
            });
        },
        [map]
    );

    return {
        appMode,
        selectedLocation,
        setSelectedLocation,
        recentSearches,
        isLoading,
        error,
        currentCoordinate,
        setCurrentCoordinate,
        searchQuery,
        setSearchQuery,
        filteredSuggestions,
        enterSearchMode,
        exitSearchMode,
        enterPinMode,
        exitPinMode,
        enterPlaceInfo,
        exitPlaceInfo,
        selectLocation,
    };
};
