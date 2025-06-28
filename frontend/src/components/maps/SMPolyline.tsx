import { useEffect, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface SMPolylineProps extends google.maps.PolylineOptions {
    path: google.maps.LatLngLiteral[] | google.maps.MVCArray<google.maps.LatLng>;
}

export function SMPolyline(props: SMPolylineProps) {
    const map = useMap();
    const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

    useEffect(() => {
        if (!map) return;

        const newPolyline = new google.maps.Polyline();
        setPolyline(newPolyline);

        return () => {
            newPolyline.setMap(null);
        };
    }, [map]);

    // track atributes changes
    useEffect(() => {
        if (!polyline) return;

        polyline.setOptions(props);
        polyline.setPath(props.path);
    }, [polyline, props]);

    // apply the polyline to the map
    useEffect(() => {
        if (!polyline || !map) return;

        polyline.setMap(map);
    }, [polyline, map]);

    // this component render directly to the map
    return null;
}
