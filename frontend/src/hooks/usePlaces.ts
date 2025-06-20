import { useCallback, useState } from 'react';
import { usePlacesSearch } from './usePlacesSearch';
import { useLocation } from '@/contexts/LocationContext';
import type { Location } from '@/lib/types';

export function usePlaces() {
  const { setSelectedLocation, addToRecentSearches } = useLocation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    filteredSuggestions,
    isLoading: isSearchLoading,
    searchPlaces,
    getCoordinatesFromPlaceId,
  } = usePlacesSearch();

  const handleLocationSelect = useCallback(async (location: Location) => {
    try {
      setIsSearching(true);
      setSearchError(null);

      // If location has coordinates, use them
      if (location.coordinate) {
        setSelectedLocation(location);
        addToRecentSearches(location);
      }

      // If location has a placeId but no coordinates, fetch them
      if (location.placeId) {
        const coords = await getCoordinatesFromPlaceId(location.placeId);
        if (coords) {
          const locationWithCoords = { ...location, coordinate: coords };
          setSelectedLocation(locationWithCoords);
          addToRecentSearches(locationWithCoords);
        }
      }
    } catch (err) {
      console.error('Error selecting location:', err);
      setSearchError('Failed to select location');
    } finally {
      setIsSearching(false);
    }
  }, [setSelectedLocation, addToRecentSearches, getCoordinatesFromPlaceId]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchError(null);
  }, [setSearchQuery]);

  return {
    // Search state
    searchQuery,
    setSearchQuery,
    filteredSuggestions,
    isSearching,
    isSearchLoading,
    searchError,

    // Search actions
    searchPlaces,
    handleLocationSelect,
    clearSearch,
    getCoordinatesFromPlaceId,
  };
}
