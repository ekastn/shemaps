import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

interface AuthContextType {
    deviceId: string | null;
    jwtToken: string | null;
    setJwtToken: (token: string | null) => void;
    clearAuth: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

        setIsLoading(false); // Auth context is loaded
    }, []);

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
                isLoading,
            }}
        >
            {isLoading ? <div>Loading authentication...</div> : children}
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
