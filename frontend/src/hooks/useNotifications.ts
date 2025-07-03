// src/hooks/useNotifications.ts
import type { Coordinate } from "@/lib/types";
import { useMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import { toast } from "sonner";

// This payload type should match the one defined in the backend
interface PanicAlertPayload {
    username: string;
    lat: number;
    lng: number;
}

export function useNotifications() {
    const map = useMap();

    const handleViewLocation = useCallback(
        (coords: Coordinate) => {
            if (map) {
                map.panTo(coords);
                map.setZoom(17);
            }
        },
        [map]
    );

    const showPanicAlert = useCallback(
        (payload: PanicAlertPayload) => {
            toast.error("Emergency Alert", {
                description: `${payload.username} has triggered a panic alert nearby.`,
                duration: 15000, // Make the toast stay on screen longer
                action: {
                    label: "View on Map",
                    onClick: () => {
                        handleViewLocation({ lat: payload.lat, lng: payload.lng });
                    },
                },
            });
        },
        [map]
    );

    return { showPanicAlert };
}
