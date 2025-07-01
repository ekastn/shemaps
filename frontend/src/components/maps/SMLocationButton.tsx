import { useLocation } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";

export function SMLocationButton() {
    const { panToCurrentLocation } = useLocation();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={panToCurrentLocation}
            className="bg-white shadow-md size-12 rounded-full"
        >
            <LocateFixed className="h-5 w-5" />
        </Button>
    );
}
