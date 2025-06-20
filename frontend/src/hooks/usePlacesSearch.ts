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

    // Search places function
    const searchPlaces = useCallback(async (query: string) => {
        if (!autocompleteServiceRef.current) return [];
        
        try {
            const request = {
                query: query,
                fields: ['name', 'formatted_address', 'geometry', 'place_id'],
            };
            
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            const results = await new Promise<google.maps.places.PlaceResult[]>((resolve) => {
                service.textSearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        resolve(results);
                    } else {
                        resolve([]);
                    }
                });
            });
            
            return results.map((result, index) => {
                const location: Location = {
                    id: index, // Use index as ID since we need a number
                    name: result.name || '',
                    address: result.formatted_address || '',
                    placeId: result.place_id,
                };
                
                if (result.geometry?.location) {
                    location.coordinate = {
                        lat: result.geometry.location.lat(),
                        lng: result.geometry.location.lng(),
                    };
                }
                
                return location;
            });
        } catch (error) {
            console.error('Error searching places:', error);
            return [];
        }
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        filteredSuggestions,
        isLoading,
        getCoordinatesFromPlaceId,
        searchPlaces,
    };
};
