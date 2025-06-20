import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { cn } from "../../lib/utils";
import { useEffect, useRef } from "react";
import type { Coordinate } from "@/lib/types";
import { Pin } from "lucide-react";

type SMMapProps = {
    center: Coordinate;
    zoom: number;
    className?: string;
    markerCoordinate?: Coordinate;
    // onClick?: (event: google.maps.MapMouseEvent) => void;
    setMapRef?: (map: google.maps.Map) => void;
    mapId?: string;
};

export function SMMap({
    center,
    zoom,
    className,
    markerCoordinate,
    // onClick,
    setMapRef,
    mapId = "shemaps-map",
}: SMMapProps) {
    const mapRef = useRef<google.maps.Map | null>(null);

    useEffect(() => {
        if (mapRef.current && center) {
            mapRef.current.panTo(center);
        }
    }, [center]);

    // Set mapRef for parent if needed
    useEffect(() => {
        if (setMapRef && mapRef.current) {
            setMapRef(mapRef.current);
        }
    }, [setMapRef]);

    return (
        <div className={cn("w-full h-full", className)}>
            <Map
                defaultCenter={center}
                defaultZoom={zoom}
                disableDefaultUI={true}
                gestureHandling="greedy"
                clickableIcons={false}
                mapId={mapId}
            // onClick={onClick}
            >
                {markerCoordinate && (
                    <AdvancedMarker
                        position={markerCoordinate}
                        title={markerCoordinate.title || 'Selected location'}
                    >
                        <div className="relative">
                            <div className="absolute -translate-x-1/2 -translate-y-full">
                                <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                                    <Pin className="w-5 h-5" fill="currentColor" />
                                </div>
                                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-blue-600 transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
                            </div>
                        </div>
                    </AdvancedMarker>
                )}
            </Map>
        </div>
    );
}
