import { useLocation } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";

interface SMLocationButtonProps {
    className?: string;
    onClick?: () => void;
}

export function SMLocationButton({ className, onClick }: SMLocationButtonProps) {
    const { panToCurrentLocation } = useLocation();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => { panToCurrentLocation(); onClick?.(); }}
            className={`bg-white shadow-md size-12 rounded-full cursor-pointer ${className}`}
        >
            <LocateFixed className="h-5 w-5" />
        </Button>
    );
}
