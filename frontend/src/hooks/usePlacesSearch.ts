import { useState, useEffect, useRef, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import type { Location } from "@/lib/types";

export const usePlacesSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesLib = useMapsLibrary("places");
    const geocoderLib = useMapsLibrary("geocoding");

    // Initialize the autocomplete service
    useEffect(() => {
        if (!placesLib || !geocoderLib) return;
        autocompleteServiceRef.current = new placesLib.AutocompleteService();
    }, [placesLib, geocoderLib]);

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

    const getPlaceFromCoordinates = useCallback(
        async (coordinates: google.maps.LatLngLiteral): Promise<Location | null> => {
            if (!window.google?.maps?.Geocoder) {
                console.error("Geocoder API not loaded");
                return null;
            }

            return new Promise((resolve) => {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: coordinates }, (results, status) => {
                    if (status === window.google.maps.GeocoderStatus.OK && results?.[0]) {
                        const place = results[0];
                        const addressParts = place.formatted_address.split(',');
                        const name = addressParts[0];
                        const address = addressParts.slice(1).join(',').trim();

                        const location: Location = {
                            id: 0, // A static ID is acceptable here as we get only one result
                            name: name,
                            address: address,
                            placeId: place.place_id,
                            coordinate: coordinates,
                        };
                        resolve(location);
                    } else {
                        console.error(`Geocode was not successful for the following reason: ${status}`);
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
        searchPlaces,
        getPlaceFromCoordinates,
    };
};
