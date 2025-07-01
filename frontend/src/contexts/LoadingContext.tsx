import { createContext, useContext, useState, type ReactNode } from "react";

interface LoadingContextType {
    isAuthLoaded: boolean;
    isMapsLoaded: boolean;
    isGeolocationLoaded: boolean;
    setAuthLoaded: (loaded: boolean) => void;
    setMapsLoaded: (loaded: boolean) => void;
    setGeolocationLoaded: (loaded: boolean) => void;
    isAppLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);
    const [isMapsLoaded, setIsMapsLoaded] = useState(false);
    const [isGeolocationLoaded, setIsGeolocationLoaded] = useState(false);

    const isAppLoading = !(isAuthLoaded && isMapsLoaded && isGeolocationLoaded);

    const setAuthLoaded = (loaded: boolean) => setIsAuthLoaded(loaded);
    const setMapsLoaded = (loaded: boolean) => setIsMapsLoaded(loaded);
    const setGeolocationLoaded = (loaded: boolean) => setIsGeolocationLoaded(loaded);

    return (
        <LoadingContext.Provider
            value={{
                isAuthLoaded,
                isMapsLoaded,
                isGeolocationLoaded,
                setAuthLoaded,
                setMapsLoaded,
                setGeolocationLoaded,
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