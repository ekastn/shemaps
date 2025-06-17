import { useState, useCallback } from "react";
import type { SearchMode, Location } from "@/lib/types";
import { MOCK_LOCATIONS } from "@/lib/constants";

export const useSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMode, setSearchMode] = useState<SearchMode>("map");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [recentSearches, setRecentSearches] = useState(MOCK_LOCATIONS.slice(0, 2));

    const enterSearchMode = useCallback(() => {
        setSearchMode("search");
    }, []);

    const exitSearchMode = useCallback(() => {
        setSearchMode("map");
        setSearchQuery("");
    }, []);

    const filterLocations = (locations: Location[], query: string): Location[] => {
        if (!query.trim()) return [];

        const lowercaseQuery = query.toLowerCase();
        return locations.filter(
            (location) =>
                location.name.toLowerCase().includes(lowercaseQuery) ||
                location.address.toLowerCase().includes(lowercaseQuery)
        );
    };

    const selectLocation = useCallback(
        (location: Location) => {
            setSelectedLocation(location);
            setSearchQuery(location.name);
            setSearchMode("map");

            // Add to recent searches if not already there
            if (!recentSearches.includes(location)) {
                setRecentSearches((prev) => [location, ...prev]);
            }
        },
        [recentSearches]
    );

    const updateSearchQuery = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const filteredSuggestions = filterLocations(MOCK_LOCATIONS, searchQuery);

    return {
        searchQuery,
        searchMode,
        selectedLocation,
        recentSearches,
        filteredSuggestions,
        enterSearchMode,
        exitSearchMode,
        selectLocation,
        updateSearchQuery,
    };
};
