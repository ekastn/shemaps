import { useState, useEffect, useRef, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import type { Location } from "@/lib/types";

export const usePlacesSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesLib = useMapsLibrary("places");

    // Initialize the autocomplete service
    useEffect(() => {
        if (!placesLib) return;
        autocompleteServiceRef.current = new placesLib.AutocompleteService();
    }, [placesLib]);

    // Fetch autocomplete suggestions
    const fetchSuggestions = useCallback(
        async (query: string) => {
            if (!autocompleteServiceRef.current || !query.trim()) {
                setFilteredSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                autocompleteServiceRef.current.getPlacePredictions(
                    { input: query },
                    (predictions, status) => {
                        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
                            setFilteredSuggestions([]);
                            return;
                        }
                        const locations: Location[] = predictions.map((suggestion, index) => ({
                            id: index,
                            name: suggestion.structured_formatting.main_text,
                            address: suggestion.structured_formatting?.secondary_text || "",
                            placeId: suggestion.place_id,
                        }));
                        setFilteredSuggestions(locations);
                    }
                );
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setFilteredSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Debounce the search query
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSuggestions(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, fetchSuggestions]);

    // Get coordinates from placeId
    const getCoordinatesFromPlaceId = useCallback(
        async (placeId: string): Promise<google.maps.LatLngLiteral | null> => {
            if (!window.google?.maps?.places) return null;

            return new Promise((resolve) => {
                const placesService = new window.google.maps.places.PlacesService(
                    document.createElement("div")
                );

                placesService.getDetails({ placeId }, (place, status) => {
                    if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        place?.geometry?.location
                    ) {
                        resolve({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        });
                    } else {
                        resolve(null);
                    }
                });
            });
        },
        []
    );

    return {
        searchQuery,
        setSearchQuery,
        filteredSuggestions,
        isLoading,
        getCoordinatesFromPlaceId,
    };
};
