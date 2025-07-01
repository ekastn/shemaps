import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { UserLocation } from "@/lib/types";
import { useAuth } from "./AuthContext";
import { websocketService } from "../services/websocketService";

interface RealtimeContextType {
    otherUsers: UserLocation[];
    sendLocation: (lat: number, lng: number) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
    const [otherUsers, setOtherUsers] = useState<UserLocation[]>([]);
    const { isAuthenticated, deviceId, user } = useAuth();

    useEffect(() => {
        const handleMessage = (message: any) => {
            if (message.type === "all_users_locations") {
                setOtherUsers(message.payload.users);
            }
        };

        if (isAuthenticated || deviceId) {
            websocketService.connect(
                {
                    onMessage: handleMessage,
                },
                deviceId
            );
        }

        return () => {
            websocketService.disconnect();
        };
    }, [isAuthenticated, deviceId]);

    const sendLocation = useCallback(
        (lat: number, lng: number) => {
            if (isAuthenticated || deviceId) {
                const message = {
                    type: "update_location",
                    payload: {
                        lat,
                        lng,
                    },
                };
                websocketService.send(message);
            }
        },
        [isAuthenticated, deviceId]
    );

    return (
        <RealtimeContext.Provider value={{ otherUsers, sendLocation }}>
            {children}
        </RealtimeContext.Provider>
    );
};

export const useRealtime = () => {
    const context = useContext(RealtimeContext);
    if (context === undefined) {
        throw new Error("useRealtime must be used within a RealtimeProvider");
    }
    return context;
};
