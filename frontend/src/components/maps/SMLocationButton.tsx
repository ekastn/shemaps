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
            variant="ghost"
            size="icon"
            onClick={() => { panToCurrentLocation(); onClick?.(); }}
            className={`bg-shemaps-main text-white shadow-md size-14 rounded-full cursor-pointer ${className}`}
        >
            <LocateFixed className="size-6" />
        </Button>
    );
}
