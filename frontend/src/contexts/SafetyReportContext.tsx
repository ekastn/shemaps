import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import type { SafetyReport } from "@/lib/types"; // Kita perlu tambahkan tipe data ini

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

    const fetchReportsInBounds = useCallback(async (bounds: google.maps.LatLngBounds) => {
        setIsLoading(true);
        setError(null);
        try {
            const north = bounds.getNorthEast().lat();
            const south = bounds.getSouthWest().lat();
            const east = bounds.getNorthEast().lng();
            const west = bounds.getSouthWest().lng();

            const response = await fetch(
                `http://localhost:3021/api/v1/reports?north=${north}&south=${south}&east=${east}&west=${west}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch safety reports");
            }

            const apiResponse = await response.json();

            setReports(apiResponse.data || []);
        } catch (err) {
            console.error("Error fetching reports:", err);
            setError("Could not load safety reports.");
        } finally {
            setIsLoading(false);
        }
    }, []);

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
