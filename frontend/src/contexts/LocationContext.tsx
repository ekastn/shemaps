import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Location, Coordinate } from '@/lib/types';
import { useMap } from '@vis.gl/react-google-maps';
import { useNavigate } from 'react-router';

interface LocationContextType {
  currentCoordinate: Coordinate | null;
  selectedLocation: Location | null;
  recentSearches: Location[];
  setCurrentCoordinate: (coord: Coordinate | null) => void;
  setSelectedLocation: (location: Location | null) => void;
  addToRecentSearches: (location: Location) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentCoordinate, setCurrentCoordinate] = useState<Coordinate | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);

  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    if (map?.panTo && selectedLocation?.coordinate) {
      map.panTo(selectedLocation.coordinate);
    }
    if (selectedLocation) {
      navigate(`/place/${selectedLocation?.id}`);
    }
  }, [selectedLocation]);

  const addToRecentSearches = (location: Location) => {
    setRecentSearches(prev => {
      const newSearches = prev.filter(item => item.placeId !== location.placeId);
      return [location, ...newSearches].slice(0, 5);
    });
  };

  return (
    <LocationContext.Provider
      value={{
        currentCoordinate,
        selectedLocation,
        recentSearches,
        setCurrentCoordinate,
        setSelectedLocation,
        addToRecentSearches,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
