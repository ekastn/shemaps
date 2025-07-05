import { authenticatedFetch } from "@/lib/api";
import type { SafetyReport } from "@/lib/types"; // Kita perlu tambahkan tipe data ini
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useLoading } from "./LoadingContext";

interface SafetyReportContextType {
    reports: SafetyReport[];
    fetchReportsInBounds: (bounds: google.maps.LatLngBounds) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const SafetyReportContext = createContext<SafetyReportContextType | undefined>(undefined);

export function SafetyReportProvider({ children }: { children: ReactNode }) {
    const [reports, setReports] = useState<SafetyReport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { jwtToken, deviceId } = useAuth();
    const { isAuthLoaded } = useLoading();

    const fetchReportsInBounds = useCallback(async (bounds: google.maps.LatLngBounds) => {
        if (!isAuthLoaded) return;
        setIsLoading(true);
        setError(null);
        try {
            const north = bounds.getNorthEast().lat();
            const south = bounds.getSouthWest().lat();
            const east = bounds.getNorthEast().lng();
            const west = bounds.getSouthWest().lng();

            const resp = await authenticatedFetch(
                `/reports?north=${north}&south=${south}&east=${east}&west=${west}`,
                { token: jwtToken, deviceId: deviceId }
            );

            setReports(resp.data || []);
        } catch (err) {
            console.error("Error fetching reports:", err);
            setError("Could not load safety reports.");
        } finally {
            setIsLoading(false);
        }
    }, [isAuthLoaded, jwtToken, deviceId]);

    return (
        <SafetyReportContext.Provider value={{ reports, fetchReportsInBounds, isLoading, error }}>
            {children}
        </SafetyReportContext.Provider>
    );
}

export function useSafetyReports() {
    const context = useContext(SafetyReportContext);
    if (context === undefined) {
        throw new Error("useSafetyReports must be used within a SafetyReportProvider");
    }
    return context;
}
