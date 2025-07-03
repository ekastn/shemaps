import type React from "react";
import { Outlet } from "react-router";
import { Toaster } from "../ui/sonner";
import { SMMap } from "../maps/SMMap";
import { useLocation } from "@/contexts/LocationContext";

export const MainLayout: React.FC = () => {
    const { currentCoordinate, selectedLocation } = useLocation();
    const defaultCenter = { lat: -6.2088, lng: 106.8456 };
    return (
        <div className="flex min-h-screen bg-background">
            <SMMap
                center={currentCoordinate || defaultCenter}
                markerCoordinate={selectedLocation?.coordinate}
                className="absolute inset-0"
                mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
            />

            <Toaster position="top-center" />
            <main>
                <Outlet />
            </main>
        </div>
    );
};
