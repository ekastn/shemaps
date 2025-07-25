import { Map, AdvancedMarker, useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { cn, getRouteColor } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { Coordinate } from "@/lib/types";
import { CircleDot, MapPin, Pin, ShieldAlert, ShieldQuestion, CircleUserRound } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { SMPolyline } from "./SMPolyline";
import { useDirections } from "@/contexts/DirectionsContext";
import { useSafetyReports } from "@/contexts/SafetyReportContext";
import { useRealtime } from "@/contexts/RealtimeContext";
import { SMRoutedPolyline } from "./SMRoutedPolyline";

type SMMapProps = {
    center: Coordinate;
    className?: string;
    markerCoordinate?: Coordinate;
    // onClick?: (event: google.maps.MapMouseEvent) => void;
    setMapRef?: (map: google.maps.Map) => void;
    mapId?: string;
};

// Definisikan gaya peta di luar komponen agar tidak dibuat ulang setiap render
const mapStyles: google.maps.MapTypeStyle[] = [
    {
        featureType: "poi", // Target semua Points of Interest
        elementType: "labels",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "transit", // Target ikon transit (stasiun, halte)
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
    },
];

export function SMMap({
    center,
    className,
    markerCoordinate,
    // onClick,
    setMapRef,
    mapId = "shemaps-map",
}: SMMapProps) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const { currentCoordinate } = useLocation();
    const { routes, selectedRouteIndex, setSelectedRouteIndex } = useDirections();
    const { reports, fetchReportsInBounds } = useSafetyReports();
    const { otherUsers } = useRealtime();

    const map = useMap();
    const geometryLibrary = useMapsLibrary("geometry");

    useEffect(() => {
        if (mapRef.current && center) {
            mapRef.current.panTo(center);
        }
    }, [center]);

    useEffect(() => {
        if (!map) return;
        const idleListener = map.addListener("idle", () => {
            const bounds = map.getBounds();
            if (bounds) {
                fetchReportsInBounds(bounds);
            }
        });
        return () => google.maps.event.removeListener(idleListener);
    }, [map, fetchReportsInBounds]);

    // Set mapRef for parent if needed
    useEffect(() => {
        if (setMapRef && mapRef.current) {
            setMapRef(mapRef.current);
        }
    }, [setMapRef]);

    if (!currentCoordinate) {
        return null;
    }

    const canRenderRoutes = routes && routes.length > 0 && geometryLibrary;

    return (
        <div className={cn("w-full h-full", className)}>
            <Map
                defaultCenter={currentCoordinate}
                defaultZoom={18}
                disableDefaultUI={true}
                gestureHandling="greedy"
                clickableIcons={false}
                keyboardShortcuts={false}
                styles={mapStyles}
                mapId={mapId}
                // onClick={onClick}
            >
                {reports.map((report) => (
                    <AdvancedMarker
                        key={report.id}
                        position={{ lat: report.latitude, lng: report.longitude }}
                        title={report.description || report.safety_level}
                    >
                        <div className="p-1 bg-white rounded-full shadow">
                            {report.safety_level === "DANGEROUS" && (
                                <ShieldAlert className="w-5 h-5 text-red-600" />
                            )}
                            {report.safety_level === "CAUTIOUS" && (
                                <ShieldQuestion className="w-5 h-5 text-yellow-600" />
                            )}
                            {report.safety_level === "SAFE" && (
                                <Pin className="w-5 h-5 text-green-600" />
                            )}
                        </div>
                    </AdvancedMarker>
                ))}
                {canRenderRoutes &&
                    routes.map((route, index) => (
                        <SMRoutedPolyline
                            key={index}
                            route={route}
                            index={index}
                            selectedRouteIndex={selectedRouteIndex}
                            setSelectedRouteIndex={setSelectedRouteIndex}
                        />
                    ))}
                {otherUsers.map((user) => (
                    <AdvancedMarker
                        key={user.device_id}
                        position={{ lat: user.lat, lng: user.lng }}
                        title={`User ${user.device_id}`}
                    >
                        <div
                            className={`p-1 rounded-full shadow ${user.is_in_panic ? "bg-red-500 animate-pulse" : "bg-primary"}`}
                        >
                            {user.is_in_panic ? (
                                <ShieldAlert className="w-5 h-5 text-white" />
                            ) : (
                                <CircleUserRound className="w-5 h-5 text-white" />
                            )}
                        </div>
                    </AdvancedMarker>
                ))}
                {markerCoordinate && (
                    <AdvancedMarker
                        position={markerCoordinate}
                        title={markerCoordinate.title || "Selected location"}
                    >
                        <div className="relative">
                            <div className="absolute -translate-x-1/2 -translate-y-full">
                                <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                                    <MapPin className="w-5 h-5" fill="currentColor" />
                                </div>
                                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-blue-600 transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
                            </div>
                        </div>
                    </AdvancedMarker>
                )}
                {currentCoordinate && (
                    <AdvancedMarker
                        position={currentCoordinate}
                        title={currentCoordinate.title || "Current location"}
                    >
                        <div className="relative">
                            <div className="absolute -translate-x-1/2 -translate-y-full">
                                <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                                    <CircleDot className="w-5 h-5" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    </AdvancedMarker>
                )}
            </Map>
        </div>
    );
}
