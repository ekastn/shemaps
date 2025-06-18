import { Map } from "@vis.gl/react-google-maps";
import { cn } from "../../lib/utils";
import { useEffect, useRef } from "react";
import type { Coordinate } from "@/lib/types";

type SMMapProps = {
    center: Coordinate;
    zoom: number;
    className?: string;
    // onClick?: (event: google.maps.MapMouseEvent) => void;
    onMapLoad?: (map: google.maps.Map) => void;
    mapId?: string;
};

export function SMMap({
    center,
    zoom,
    className,
    // onClick,
    onMapLoad,
    mapId = "shemaps-map",
}: SMMapProps) {
    const mapRef = useRef<google.maps.Map | null>(null);

    const onMapInstanceLoad = (map: google.maps.Map) => {
        mapRef.current = map;
        if (onMapLoad) {
            onMapLoad(map);
        }
    };

    useEffect(() => {
        if (mapRef.current && center) {
            mapRef.current.panTo(center);
        }
    }, [center]);

    return (
        <div className={cn("w-full h-full", className)}>
            <Map
                defaultCenter={center}
                defaultZoom={zoom}
                disableDefaultUI={true}
                gestureHandling="greedy"
                // onClick={onClick}
                onLoad={onMapInstanceLoad}
            />
        </div>
    );
}
