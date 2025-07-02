import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { UserLocation } from "@/lib/types";
import { useAuth } from "./AuthContext";
import { useLoading } from "./LoadingContext";
import { websocketService } from "../services/websocketService";

interface RealtimeContextType {
    otherUsers: UserLocation[];
    sendLocation: (lat: number, lng: number) => void;
    triggerPanic: () => void;
    isPanicMode: boolean;
    resolvePanic: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
    const [otherUsers, setOtherUsers] = useState<UserLocation[]>([]);
    const [isPanicMode, setIsPanicMode] = useState(false);
    const { isAuthenticated, deviceId, user } = useAuth();
    const { setRealtimeLoaded } = useLoading();

    useEffect(() => {
        const handleMessage = (message: any) => {
            if (message.type === "all_users_locations") {
                if (!message.payload.users) return;
                const filteredUsers = message.payload.users.filter(
                    (u: UserLocation) => u.device_id !== deviceId
                );
                setOtherUsers(filteredUsers);
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

        setRealtimeLoaded(true);
        return () => {
            websocketService.disconnect();
        };
    }, [isAuthenticated, deviceId, user]);

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

    const triggerPanic = useCallback(() => {
        if (isAuthenticated || deviceId) {
            const message = {
                type: "trigger_panic",
            };
            websocketService.send(message);
            setIsPanicMode(true);
        }
    }, [isAuthenticated, deviceId]);

    const resolvePanic = useCallback(() => {
        if (isAuthenticated || deviceId) {
            const message = {
                type: "resolve_panic",
            };
            websocketService.send(message);
            setIsPanicMode(false);
        }
    }, [isAuthenticated, deviceId]);

    return (
        <RealtimeContext.Provider value={{ otherUsers, sendLocation, triggerPanic, isPanicMode, resolvePanic }}>
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
