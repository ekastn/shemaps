import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Location, Coordinate } from "@/lib/types";
import { useMap } from "@vis.gl/react-google-maps";
import { useNavigate } from "react-router";
import { Geolocation, type Position as CapPosition } from "@capacitor/geolocation"; 
import { Capacitor } from "@capacitor/core";
import { useLoading } from "./LoadingContext"; // Import useLoading
import { useRealtime } from "./RealtimeContext";
import { areCoordinatesClose } from "@/lib/utils";

interface LocationContextType {
    currentCoordinate: Coordinate | null;
    selectedLocation: Location | null;
    recentSearches: Location[];
    setCurrentCoordinate: (coord: Coordinate | null) => void;
    setSelectedLocation: (location: Location | null) => void;
    addToRecentSearches: (location: Location) => void;
    toggleMapCameraView: () => void;
    currentHeading: number | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [currentCoordinate, setCurrentCoordinate] = useState<Coordinate | null>(null);
    const [currentHeading, setCurrentHeading] = useState<number | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [recentSearches, setRecentSearches] = useState<Location[]>(() => {
        try {
            const storedSearches = localStorage.getItem("recentSearches");
            return storedSearches ? JSON.parse(storedSearches) : [];
        } catch (error) {
            console.error("Failed to parse recent searches from localStorage:", error);
            return [];
        }
    });

    const map = useMap();
    const navigate = useNavigate();
    const { setGeolocationLoaded } = useLoading(); // Use setGeolocationLoaded from LoadingContext

    useEffect(() => {
        if (map?.panTo && selectedLocation?.coordinate) {
            map.panTo(selectedLocation.coordinate);
            map.setZoom(18);
            navigate(`/place/${selectedLocation?.id}`);
        }
    }, [selectedLocation, map, navigate]);

    useEffect(() => {
        const setupGeolocation = async () => {
            try {
                if (Capacitor.isNativePlatform()) {
                    let permStatus = await Geolocation.checkPermissions();
                    if (permStatus.location !== 'granted') {
                        permStatus = await Geolocation.requestPermissions();
                        if (permStatus.location !== 'granted') {
                            console.warn("Geolocation permission not granted.");
                            return;
                        }
                    }
                }

                const options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                };

                const watchCallback = (position: CapPosition | null, error?: any) => {
                    if (error) {
                        console.error("Error getting location:", error);
                        return;
                    }
                    if (position) {
                        const { latitude, longitude, heading } = position.coords;
                        const newCoord = { lat: latitude, lng: longitude };
                        setCurrentCoordinate(newCoord);
                        if (heading !== null) {
                            setCurrentHeading(heading);
                        }
                    }
                };

                const callbackId = await Geolocation.watchPosition(options, watchCallback);

                setGeolocationLoaded(true); // Signal that Geolocation is loaded

                return () => {
                    Geolocation.clearWatch({ id: callbackId });
                };
            } catch (error) {
                console.error("Error setting up geolocation:", error);
                setGeolocationLoaded(true); // Also signal loaded on error to prevent infinite loading
            }
        };

        setupGeolocation();
    }, [setGeolocationLoaded]); // Add setGeolocationLoaded to dependency array

    const { sendLocation } = useRealtime();

    useEffect(() => {
        if (currentCoordinate) {
            const interval = setInterval(() => {
                sendLocation(currentCoordinate.lat, currentCoordinate.lng);
            }, 3000); // Send location every 10 seconds

            return () => clearInterval(interval);
        }
    }, [currentCoordinate, sendLocation]);

    useEffect(() => {
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }, [recentSearches]);

    const toggleMapCameraView = () => {
        if (!map || !currentCoordinate) {
            return;
        }

        const currentMapCenter = map.getCenter();
        const currentTilt = map.getTilt();
        const currentHeading = map.getHeading();

        const isMapCentered = currentMapCenter && areCoordinatesClose(
            { lat: currentMapCenter.lat(), lng: currentMapCenter.lng() },
            currentCoordinate
        );

        const isDefaultView = Math.abs(currentTilt) < 0.01 && Math.abs(currentHeading) < 0.01;

        if (!isMapCentered) {
            // If map is not centered on current location, pan to it and reset view
            map.panTo(currentCoordinate);
            map.setZoom(18);
            map.setTilt(0);
            map.setHeading(0);
        } else if (!isDefaultView) {
            // If map is centered but not in default view, reset view
            map.setTilt(0);
            map.setHeading(0);
            map.panTo(currentCoordinate);
            map.setZoom(18);
        } else {
            // If map is centered and in default view, switch to tilted view
            map.setTilt(45);
            map.setHeading(currentHeading !== null ? currentHeading : 0);
            map.panTo(currentCoordinate);
            map.setZoom(18);
        }
    };

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
                toggleMapCameraView,
                currentHeading
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
