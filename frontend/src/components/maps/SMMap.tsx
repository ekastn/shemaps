import { Map } from "@vis.gl/react-google-maps";
import { cn } from "../../lib/utils";

type SMMapProps = {
    center: { lat: number; lng: number };
    zoom: number;
    className?: string;
};

export function SMMap(props: SMMapProps) {
    return (
        <div className={cn("w-full h-full", props.className)}>
            <Map
                defaultCenter={props.center}
                defaultZoom={props.zoom}
                disableDefaultUI={true}
                gestureHandling="greedy"
            />
        </div>
    );
}
