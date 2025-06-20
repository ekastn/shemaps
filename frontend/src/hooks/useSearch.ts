import { useCallback } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import type { Location } from "@/lib/types";
import { useAppMode } from "./useAppMode";
import { useLocationManager } from "./useLocationManager";
import { usePlacesSearch } from "./usePlacesSearch";

export const useSearch = () => {
    const map = useMap();
    
    // App mode management
    const {
        appMode,
        enterSearchMode,
        exitSearchMode,
        enterPinMode,
        exitPinMode,
        enterPlaceInfo,
        exitPlaceInfo,
    } = useAppMode();

    // Location management
    const {
        recentSearches,
        selectedLocation,
        setSelectedLocation,
        currentCoordinate,
        setCurrentCoordinate,
        error,
        addToRecentSearches,
    } = useLocationManager();

    // Places search functionality
    const {
        searchQuery,
        setSearchQuery,
        filteredSuggestions,
        isLoading,
        getCoordinatesFromPlaceId,
    } = usePlacesSearch();

    // Handle location selection
    const selectLocation = useCallback(
        async (location: Location) => {
            const locationWithCoord = { ...location };
            
            // Fetch coordinates if we have a placeId but no coordinates
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

            // Use current map center as fallback if still no coordinates
            if (!locationWithCoord.coordinate) {
                locationWithCoord.coordinate = {
                    lat: currentCoordinate.lat,
                    lng: currentCoordinate.lng,
                    title: location.name,
                };
            }

            // Update state
            setSelectedLocation(locationWithCoord);
            setSearchQuery(location.name);
            setCurrentCoordinate(locationWithCoord.coordinate);
            addToRecentSearches(locationWithCoord);
            enterPlaceInfo();

            // Update map view
            if (map?.panTo && locationWithCoord.coordinate) {
                map.panTo(locationWithCoord.coordinate);
            }
        },
        [map, currentCoordinate, getCoordinatesFromPlaceId, setSelectedLocation, setSearchQuery, setCurrentCoordinate, addToRecentSearches, enterPlaceInfo]
    );

    // Enhanced exitPlaceInfo that also clears search
    const exitPlaceInfoAndClear = useCallback(() => {
        exitPlaceInfo();
        setSearchQuery("");
        setSelectedLocation(null);
    }, [exitPlaceInfo, setSearchQuery]);

    return {
        // App mode
        appMode,
        enterSearchMode,
        exitSearchMode,
        enterPinMode,
        exitPinMode,
        enterPlaceInfo,
        exitPlaceInfo: exitPlaceInfoAndClear,
        
        // Location data
        selectedLocation,
        setSelectedLocation,
        recentSearches,
        currentCoordinate,
        setCurrentCoordinate,
        
        // Search functionality
        searchQuery,
        setSearchQuery,
        filteredSuggestions,
        isLoading,
        error,
        
        // Actions
        selectLocation,
    };
};
