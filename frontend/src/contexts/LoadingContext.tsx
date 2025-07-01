import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface LoadingContextType {
    isAuthLoaded: boolean;
    isMapsLoaded: boolean;
    isGeolocationLoaded: boolean;
    isRealtimeLoaded: boolean; // New: Realtime connection status
    setAuthLoaded: (loaded: boolean) => void;
    setMapsLoaded: (loaded: boolean) => void;
    setGeolocationLoaded: (loaded: boolean) => void;
    setRealtimeLoaded: (loaded: boolean) => void; // New: Setter for realtime status
    isAppLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

const MIN_LOADING_TIME = 1000; // 1 second (1000ms)

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);
    const [isMapsLoaded, setIsMapsLoaded] = useState(false);
    const [isGeolocationLoaded, setIsGeolocationLoaded] = useState(false);
    const [isRealtimeLoaded, setIsRealtimeLoaded] = useState(false); // New state for realtime
    const [minTimeElapsed, setMinTimeElapsed] = useState(false); // New state for minimum time

    // Set minimum loading time
    useEffect(() => {
        const timer = setTimeout(() => {
            setMinTimeElapsed(true);
        }, MIN_LOADING_TIME);

        return () => clearTimeout(timer);
    }, []);

    // App is loading if any core component is not loaded OR minimum time has not elapsed
    const isAppLoading = !(
        isAuthLoaded &&
        isMapsLoaded &&
        isGeolocationLoaded &&
        isRealtimeLoaded &&
        minTimeElapsed
    );

    const setAuthLoaded = (loaded: boolean) => setIsAuthLoaded(loaded);
    const setMapsLoaded = (loaded: boolean) => setIsMapsLoaded(loaded);
    const setGeolocationLoaded = (loaded: boolean) => setIsGeolocationLoaded(loaded);
    const setRealtimeLoaded = (loaded: boolean) => setIsRealtimeLoaded(loaded); // New setter for realtime

    return (
        <LoadingContext.Provider
            value={{
                isAuthLoaded,
                isMapsLoaded,
                isGeolocationLoaded,
                isRealtimeLoaded,
                setAuthLoaded,
                setMapsLoaded,
                setGeolocationLoaded,
                setRealtimeLoaded,
                isAppLoading,
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}

