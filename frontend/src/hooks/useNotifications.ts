// src/hooks/useNotifications.ts
import { toast } from "sonner";

// This payload type should match the one defined in the backend
interface PanicAlertPayload {
    username: string;
    lat: number;
    lng: number;
}

export function useNotifications() {
    const showPanicAlert = (payload: PanicAlertPayload, map: google.maps.Map | undefined) => {
        const handleViewLocation = () => {
            if (!map) return;
            map.panTo({ lat: payload.lat, lng: payload.lng });
            map.setZoom(17);
        };
        console.log("showPanicAlert map", map);

        toast.error("Emergency Alert", {
            description: `${payload.username} has triggered a panic alert nearby.`,
            duration: 15000, // Make the toast stay on screen longer
            action: {
                label: "View",
                onClick: () => {
                    handleViewLocation();
                },
            },
            actionButtonStyle: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
            },
        });
    };

    return { showPanicAlert };
}
