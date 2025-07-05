import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { Toaster } from "../ui/sonner";
import { SMMap } from "../maps/SMMap";
import { useLocation } from "@/contexts/LocationContext";
import { TutorialProvider } from "@/contexts/TutorialContext";

export const MainLayout: React.FC = () => {
    const { currentCoordinate, selectedLocation, setSelectedLocation } = useLocation();
    const defaultCenter = { lat: -6.2088, lng: 106.8456 };
    const [runTutorial, setRunTutorial] = useState(false);
    const [openMainSheet, setOpenMainSheet] = useState(false);

    useEffect(() => {
        const tutorialCompleted = localStorage.getItem('shemaps_tutorial_completed');
        if (!tutorialCompleted) {
            setRunTutorial(true);
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-background">
            <SMMap
                center={currentCoordinate || defaultCenter}
                markerCoordinate={selectedLocation?.coordinate}
                className="absolute inset-0"
                mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
            />

            <Toaster position="top-center" />
            <TutorialProvider run={runTutorial} setRun={setRunTutorial}>
                <main className="relative h-screen w-full max-w-md mx-auto overflow-hidden pointer-events-none">
                    <Outlet context={{ setRunTutorial, setOpenMainSheet, openMainSheet, setSelectedLocation }} />
                </main>
            </TutorialProvider>
        </div>
    );
};
