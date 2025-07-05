import { useMemo, useCallback } from "react";
import { SMPolyline } from "./SMPolyline";
import { getRouteColor } from "@/lib/utils";

interface SMRoutedPolylineProps {
    route: any; // Replace 'any' with your actual Route type
    index: number;
    selectedRouteIndex: number;
    setSelectedRouteIndex: (index: number) => void;
}

export function SMRoutedPolyline({
    route,
    index,
    selectedRouteIndex,
    setSelectedRouteIndex,
}: SMRoutedPolylineProps) {
    const path = useMemo(
        () =>
            google.maps.geometry.encoding.decodePath(
                (route.overview_polyline as any).points
            ) as any as google.maps.LatLngLiteral[],
        [route.overview_polyline.points]
    );

    const handleClick = useCallback(
        () => setSelectedRouteIndex(index),
        [setSelectedRouteIndex, index]
    );

    return (
        <SMPolyline
            key={index}
            path={path}
            strokeColor={getRouteColor(route.safety_level)}
            strokeOpacity={index === selectedRouteIndex ? 1.0 : 0.7}
            strokeWeight={index === selectedRouteIndex ? 8 : 6}
            zIndex={index === selectedRouteIndex ? 2 : 1}
            onClick={handleClick}
        />
    );
}
