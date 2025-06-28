import type { SafetyReport } from "@/lib/types";

interface CreateReportPayload {
    latitude: number;
    longitude: number;
    safety_level: string;
    tags: string[];
    description: string;
}

export const submitSafetyReport = async (payload: CreateReportPayload): Promise<SafetyReport> => {
    const response = await fetch("http://localhost:3021/api/v1/reports", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Gagal mengirim laporan");
    }

    const result = await response.json();
    return result.data;
};
