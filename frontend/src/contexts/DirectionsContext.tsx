import type { Coordinate, RouteWithSafety } from "@/lib/types";
import { useMap } from "@vis.gl/react-google-maps";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { authenticatedFetch } from "@/lib/api";
import { useAuth } from "./AuthContext";

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
    routes: RouteWithSafety[];
}

const DirectionsContext = createContext<DirectionsContextType | undefined>(undefined);

export function DirectionsProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [routes, setRoutes] = useState<RouteWithSafety[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

    const map = useMap();
    const { jwtToken, deviceId } = useAuth();

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
                const result = await authenticatedFetch(
                    `/routes?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`,
                    { token: jwtToken, deviceId: deviceId }
                );

                setRoutes(result.data.routes || []);
                setSelectedRouteIndex(0);
            } catch (err: any) {
                console.error("Error calculating directions:", err);
                setError(err.message || "Failed to calculate directions");
            } finally {
                setIsLoading(false);
            }
        },
        [map, jwtToken, deviceId]
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
