import type { Coordinate } from "@/lib/types";
import { useMap } from "@vis.gl/react-google-maps";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";

interface DirectionsContextType {
    isLoading: boolean;
    error: string | null;
    calculateRoute: (
        origin: Coordinate,
        destination: Coordinate,
    ) => Promise<void>;
    clearDirections: () => void;
    selectedRouteIndex: number;
    setSelectedRouteIndex: (index: number) => void;
    routes: google.maps.DirectionsRoute[];
}

const DirectionsContext = createContext<DirectionsContextType | undefined>(undefined);

export function DirectionsProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
        useState<google.maps.DirectionsService | null>(null);
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

    const map = useMap();

    const calculateRoute = useCallback(
        async (
            origin: Coordinate,
            destination: Coordinate,
        ): Promise<void> => {
            if (!map) {
                setError("Directions service not available");
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const resultsApi = await fetch(
                    `http://localhost:3021/api/v1/routes?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`
                ).then((res) => res.json());

                setRoutes(resultsApi.data.routes);
                setSelectedRouteIndex(0);
            } catch (err) {
                console.error("Error calculating directions:", err);
                setError("Failed to calculate directions");
            } finally {
                setIsLoading(false);
            }
        },
        [map]
    );

    const clearDirections = useCallback(() => {
        setRoutes([]);
        setError(null);
        setSelectedRouteIndex(0);
    }, []);

    return (
        <DirectionsContext.Provider
            value={{
                isLoading,
                error,
                calculateRoute,
                clearDirections,
                selectedRouteIndex,
                setSelectedRouteIndex,
                routes,
            }}
        >
            {children}
        </DirectionsContext.Provider>
    );
}

export function useDirections() {
    const context = useContext(DirectionsContext);
    if (context === undefined) {
        throw new Error("useDirections must be used within a DirectionsProvider");
    }
    return context;
}
