import { Map, AdvancedMarker, useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { cn, getRouteColor } from "@/lib/utils";
import { useEffect, useRef } from "react";
import type { Coordinate } from "@/lib/types";
import { CircleDot, MapPin, Pin, ShieldAlert, ShieldQuestion } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { SMPolyline } from "./SMPolyline";
import { useDirections } from "@/contexts/DirectionsContext";
import { useSafetyReports } from "@/contexts/SafetyReportContext";

type SMMapProps = {
    center: Coordinate;
    zoom: number;
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
    const { routes, selectedRouteIndex } = useDirections();
    const { reports, fetchReportsInBounds } = useSafetyReports();

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
                    routes.map((route, index) => {
                        const path = google.maps.geometry.encoding.decodePath(
                            route.overview_polyline.points
                        ) as google.maps.LatLngLiteral[];

                        return (
                            <SMPolyline
                                key={index}
                                path={path}
                                strokeColor={getRouteColor(route.safety_level)} // <-- Langsung gunakan safety_level!
                                strokeOpacity={index === selectedRouteIndex ? 1.0 : 0.5}
                                strokeWeight={index === selectedRouteIndex ? 8 : 6}
                                zIndex={index === selectedRouteIndex ? 2 : 1}
                            />
                        );
                    })}
                {markerCoordinate && (
                    <AdvancedMarker
                        position={markerCoordinate}
                        title={markerCoordinate.title || "Selected location"}
                    >
                        <div className="relative">
                            <div className="absolute -translate-x-1/2 -translate-y-full">
                                <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
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
                                <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
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
