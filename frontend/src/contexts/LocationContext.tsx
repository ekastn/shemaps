import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Location, Coordinate } from "@/lib/types";
import { useMap } from "@vis.gl/react-google-maps";
import { useNavigate } from "react-router";

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
    const [locationError, setLocationError] = useState<string | null>(null);

    const map = useMap();
    const navigate = useNavigate();

    useEffect(() => {
        if (map?.panTo && selectedLocation?.coordinate) {
            map.panTo(selectedLocation.coordinate);
            navigate(`/place/${selectedLocation?.id}`);
        }
    }, [selectedLocation]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }

        const handleSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            const newCoord = { lat: latitude, lng: longitude };
            setCurrentCoordinate(newCoord);
            setLocationError(null);

            // if (map?.panTo) {
            //   map.panTo(newCoord);
            // }
        };

        const handleError = (error: GeolocationPositionError) => {
            console.error("Error getting location:", error);
            setLocationError("Unable to retrieve your location");
        };

        // Request high accuracy if needed (uses more battery)
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

        // Cleanup the geolocation watcher when component unmounts
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [map]);

    const addToRecentSearches = (location: Location) => {
        setRecentSearches((prev) => {
            const newSearches = prev.filter((item) => item.placeId !== location.placeId);
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
        throw new Error("useLocation must be used within a LocationProvider");
    }
    return context;
}
