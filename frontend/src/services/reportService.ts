import type { SafetyReport } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";

interface CreateReportPayload {
    latitude: number;
    longitude: number;
    safety_level: string;
    tags: string[];
    description: string;
}

export const submitSafetyReport = async (token: string | null, deviceId: string | null, payload: CreateReportPayload): Promise<SafetyReport> => {
    const result = await authenticatedFetch("/reports", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        token,
        deviceId,
    });
    return result.data;
};
