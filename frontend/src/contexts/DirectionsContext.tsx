import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import type { Coordinate } from '@/lib/types';

interface DirectionsContextType {
    directions: google.maps.DirectionsResult | null;
    isLoading: boolean;
    error: string | null;
    calculateRoute: (
        origin: Coordinate,
        destination: Coordinate,
        travelMode?: google.maps.TravelMode
    ) => Promise<google.maps.DirectionsResult | null>;
    clearDirections: () => void;
    selectedRouteIndex: number;
    setSelectedRouteIndex: (index: number) => void;
}

const DirectionsContext = createContext<DirectionsContextType | undefined>(undefined);

// Helper function to generate distinct colors
const getRouteColor = (index: number): string => {
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#673AB7'];
    return colors[index % colors.length];
};

// In DirectionsContext.tsx
export function DirectionsProvider({ children }: { children: ReactNode }) {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
    const [routeRenderers, setRouteRenderers] = useState<google.maps.DirectionsRenderer[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');

    // Initialize directions service
    useEffect(() => {
        if (!map || !routesLibrary) return;
        setDirectionsService(new routesLibrary.DirectionsService());
    }, [map, routesLibrary]);

    // Clean up renderers on unmount
    useEffect(() => {
        return () => {
            routeRenderers.forEach(renderer => renderer.setMap(null));
        };
    }, []); // Empty dependency array means this runs only on unmount

    const calculateRoute = useCallback(async (
        origin: Coordinate,
        destination: Coordinate,
        travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
    ) => {
        if (!directionsService || !map || !routesLibrary) {
            setError('Directions service not available');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Clear existing renderers
            routeRenderers.forEach(renderer => renderer.setMap(null));
            const newRenderers: google.maps.DirectionsRenderer[] = [];

            // Get directions from service
            const results = await directionsService.route({
                origin,
                destination,
                travelMode,
                provideRouteAlternatives: true,
            });

            // Create a renderer for each route
            results.routes.forEach((route, index) => {
                const renderer = new routesLibrary.DirectionsRenderer({
                    map,
                    directions: {
                        ...results,
                        routes: [route]
                    },
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: getRouteColor(index),
                        strokeWeight: 5,
                        strokeOpacity: 0.8,
                        // zIndex: index === 0 ? 1000 : 500 + index
                    }
                });
                newRenderers.push(renderer);
            });

            setRouteRenderers(newRenderers);
            setDirections(results);
            setSelectedRouteIndex(0);
            return results;
        } catch (err) {
            console.error('Error calculating directions:', err);
            setError('Failed to calculate directions');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [directionsService, map, routesLibrary]);

    const clearDirections = useCallback(() => {
        for (let i = 0; i < routeRenderers.length; i++) {
            routeRenderers[i].setMap(null);
        }
        setRouteRenderers([]);
        setDirections(null);
        setError(null);
        setSelectedRouteIndex(0);
    }, [routeRenderers]);

    // Update selected route
    // useEffect(() => {
    //     if (!directions || !routeRenderers.length) return;

    //     // Highlight the selected route
    //     routeRenderers.forEach((renderer, index) => {
    //         const options = renderer.getOptions();
    //         if (options.polylineOptions) {
    //             options.polylineOptions.strokeWeight = index === selectedRouteIndex ? 5 : 3;
    //             options.polylineOptions.strokeOpacity = index === selectedRouteIndex ? 0.8 : 0.5;
    //             renderer.setOptions(options);
    //         }
    //     });
    // }, [selectedRouteIndex, directions, routeRenderers]);

    return (
        <DirectionsContext.Provider
            value={{
                directions,
                isLoading,
                error,
                calculateRoute,
                clearDirections,
                selectedRouteIndex,
                setSelectedRouteIndex,
            }}
        >
            {children}
        </DirectionsContext.Provider>
    );
}

export function useDirections() {
    const context = useContext(DirectionsContext);
    if (context === undefined) {
        throw new Error('useDirections must be used within a DirectionsProvider');
    }
    return context;
}