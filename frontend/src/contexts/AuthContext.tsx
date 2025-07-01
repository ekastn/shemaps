import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLoading } from "./LoadingContext"; // Import useLoading

interface AuthContextType {
    deviceId: string | null;
    jwtToken: string | null;
    setJwtToken: (token: string | null) => void;
    clearAuth: () => void;
    // Removed isLoading from here as it will be managed globally
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    // Removed local isLoading state

    const { setAuthLoaded } = useLoading(); // Use setAuthLoaded from LoadingContext

    useEffect(() => {
        // Device ID Management
        let storedDeviceId = localStorage.getItem("device_id");
        if (!storedDeviceId) {
            storedDeviceId = uuidv4();
            localStorage.setItem("device_id", storedDeviceId);
        }
        setDeviceId(storedDeviceId);

        // JWT Token Handling
        const storedJwtToken = localStorage.getItem("jwt_token");
        if (storedJwtToken) {
            setJwtToken(storedJwtToken);
        }

        setAuthLoaded(true); // Signal that Auth context is loaded
    }, [setAuthLoaded]); // Add setAuthLoaded to dependency array

    const handleSetJwtToken = useCallback((token: string | null) => {
        if (token) {
            localStorage.setItem("jwt_token", token);
        } else {
            localStorage.removeItem("jwt_token");
        }
        setJwtToken(token);
    }, []);

    const clearAuth = useCallback(() => {
        localStorage.removeItem("jwt_token");
        setJwtToken(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                deviceId,
                jwtToken,
                setJwtToken: handleSetJwtToken,
                clearAuth,
                // Removed isLoading from value
            }}
        >
            {children} {/* Removed conditional rendering */}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
