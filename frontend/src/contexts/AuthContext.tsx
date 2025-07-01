import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLoading } from "./LoadingContext"; // Import useLoading

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    deviceId: string | null;
    jwtToken: string | null;
    setJwtToken: (token: string | null) => void;
    clearAuth: () => void;
    isAuthenticated: boolean;
    user: User | null;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const { setAuthLoaded } = useLoading();

    const isAuthenticated = !!jwtToken || !!deviceId;

    useEffect(() => {
        let storedDeviceId = localStorage.getItem("device_id");
        if (!storedDeviceId) {
            storedDeviceId = uuidv4();
            localStorage.setItem("device_id", storedDeviceId);
        }
        setDeviceId(storedDeviceId);

        const storedJwtToken = localStorage.getItem("jwt_token");
        if (storedJwtToken) {
            setJwtToken(storedJwtToken);
            setUser({ id: "dummy-user-id", email: "user@example.com" }); 
        }

        setAuthLoaded(true);
    }, [setAuthLoaded]);

    const handleSetJwtToken = useCallback((token: string | null) => {
        if (token) {
            localStorage.setItem("jwt_token", token);
            setUser({ id: "dummy-user-id", email: "user@example.com" });
        } else {
            localStorage.removeItem("jwt_token");
            setUser(null); 
        }
        setJwtToken(token);
    }, []);

    const clearAuth = useCallback(() => {
        localStorage.removeItem("jwt_token");
        setJwtToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                deviceId,
                jwtToken,
                setJwtToken: handleSetJwtToken,
                clearAuth,
                isAuthenticated,
                user,
                setUser,
            }}
        >
            {children}
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
