import { useState, useCallback, useEffect } from "react";
import type { SearchMode, Location, Coordinate, PlaceResult } from "@/lib/types";
import {
    getRecentLocations,
    convertPlaceToLocation,
} from "@/services/locationService";
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { waitForGoogleMapsToLoad } from "@/lib/utils/googleMapsLoader";

export const useSearch = () => {
    const [searchMode, setSearchMode] = useState<SearchMode>("map");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [recentSearches, setRecentSearches] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentCoordinate, setCurrentCoordinate] = useState<Coordinate>({ lat: -6.2088, lng: 106.8456 }); // Default to Jakarta
    const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);

    // Wait for Google Maps to be ready
    useEffect(() => {
        waitForGoogleMapsToLoad().then(() => {
            setIsGoogleMapsReady(true);
        });
    }, []);

    // Initialize the places autocomplete
    const {
        ready: placesReady,
        value: searchQuery,
        suggestions: { data: places, loading: isPlacesLoading },
        setValue: setSearchQuery,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search behavior options here */
            componentRestrictions: { country: 'id' }, // Restrict to Indonesia
        },
        debounce: 300,
        initOnMount: isGoogleMapsReady, // Only initialize when Google Maps is ready
    });

    const placesLib = useMapsLibrary("places");
    const map = useMap();

    const [filteredSuggestions, setFilteredSuggestions] = useState<Location[]>([]);

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

    useEffect(() => {
        if (!placesLib && !map) return;
        console.log("Places ready:", placesReady);
        const convertPlaces = async () => {
            if (isPlacesLoading) {
                setIsLoading(true);
                return;
            }

            if (!placesReady) {
                setFilteredSuggestions([]);
                setIsLoading(true);
                return;
            }

            console.log(places);

            if (places.length > 0) {
                setIsLoading(true);
                try {
                    const locations: Location[] = places.map((suggestion, index) => ({
                        id: index,
                        name: suggestion.description,
                        type: "custom",
                        address: suggestion.structured_formatting?.secondary_text || "",
                        icon: "location-marker",
                        safetyRating: "Safe",
                        placeId: suggestion.place_id
                    }));
                    
                    setFilteredSuggestions(locations);
                } catch (err) {
                    console.error("Failed to convert places to locations:", err);
                    setError("Failed to process search results");
                } finally {
                    setIsLoading(false);
                }
            } else if (searchQuery === '') {
                setFilteredSuggestions([]);
                setIsLoading(false);
            } else if (!isPlacesLoading && places.length === 0 && searchQuery.trim() !== '') {
                setFilteredSuggestions([]);
                setIsLoading(false);
            }
        };

        convertPlaces();
    }, [places, isPlacesLoading, searchQuery, placesReady]);

    const enterSearchMode = useCallback(() => {
        setSearchMode("search");
    }, []);

    const exitSearchMode = useCallback(() => {
        setSearchMode("map");
        setSearchQuery("");
        clearSuggestions();
    }, [setSearchQuery, clearSuggestions]);

    const enterPinMode = useCallback(() => {
        setSearchMode("pin");
    }, []);

    const exitPinMode = useCallback(() => {
        setSearchMode("search");
    }, []);

    const selectLocation = useCallback(
        async (location: Location) => {
            setSelectedLocation(location);
            setSearchQuery(location.name, false);
            setSearchMode("map");
            clearSuggestions();

            // Update coordinates if available
            if (location.coordinate) {
                setCurrentCoordinate(location.coordinate);
            } else if (location.placeId) {
                // If we have a placeId but no coordinates, get them from Google Places API
                try {
                    setIsLoading(true);
                    const results = await getGeocode({ placeId: location.placeId });
                    const { lat, lng } = getLatLng(results[0]);
                    const coordinate = { lat, lng };
                    
                    // Update the location with coordinates
                    const updatedLocation = { 
                        ...location, 
                        coordinate 
                    };
                    
                    setSelectedLocation(updatedLocation);
                    setCurrentCoordinate(coordinate);
                } catch (error) {
                    console.error("Error getting coordinates for place:", error);
                } finally {
                    setIsLoading(false);
                }
            }

            // Add to recent searches if not already there
            setRecentSearches((prev) => {
                if (prev.some(item => item.id === location.id)) {
                    return prev;
                }
                return [location, ...prev].slice(0, 5); // Limit to 5 recent searches
            });
        },
        [setSearchQuery, clearSuggestions]
    );

    const updateSearchQuery = useCallback((query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredSuggestions([]);
        }
    }, [setSearchQuery]);

    const updateCoordinate = useCallback((coordinate: Coordinate) => {
        setCurrentCoordinate(coordinate);
    }, []);

    return {
        searchQuery,
        searchMode,
        selectedLocation,
        recentSearches,
        filteredSuggestions,
        currentCoordinate,
        isLoading: isLoading || isPlacesLoading || !placesReady,
        error,
        enterSearchMode,
        exitSearchMode,
        enterPinMode,
        exitPinMode,
        selectLocation,
        updateSearchQuery,
        updateCoordinate,
    };
};
