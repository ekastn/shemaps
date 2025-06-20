import { useState, useCallback } from "react";
import type { AppMode } from "@/lib/types";

export const useAppMode = (initialMode: AppMode = "map") => {
    const [appMode, setAppMode] = useState<AppMode>(initialMode);

    const enterSearchMode = useCallback(() => {
        setAppMode("search");
    }, []);

    const exitSearchMode = useCallback(() => {
        setAppMode("map");
    }, []);

    const enterPinMode = useCallback(() => {
        setAppMode("pin");
    }, []);

    const exitPinMode = useCallback(() => {
        setAppMode("search");
    }, []);
    
    const enterPlaceInfo = useCallback(() => {
        setAppMode("placeInfo");
    }, []);
    
    const exitPlaceInfo = useCallback(() => {
        setAppMode("map");
    }, []);

    return {
        appMode,
        setAppMode,
        enterSearchMode,
        exitSearchMode,
        enterPinMode,
        exitPinMode,
        enterPlaceInfo,
        exitPlaceInfo,
    };
};
