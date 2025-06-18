import type { Coordinate } from "@/lib/types";
import { ArrowLeft, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface SMPinOnMapScreenProps {
    onBack: () => void;
    onCoordinateSelect: (coord: Coordinate) => void;
    coordinate: Coordinate;
}

export const SMPinOnMapScreen = ({
    onBack,
    onCoordinateSelect: onLocationSelect,
    coordinate: coordinates,
}: SMPinOnMapScreenProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        if (!coordinates) return;

        setIsLoading(true);
        try {
            onLocationSelect(coordinates);
        } catch (error) {
            console.error("Error creating custom location:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="font-medium">Choose location</h2>
                </div>
                <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    size="sm"
                    className="flex items-center space-x-1"
                >
                    {isLoading ? <span>Loading...</span> : "OK"}
                </Button>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20 pointer-events-none">
                <MapPin className="w-8 h-8 text-red-500" />
            </div>
        </>
    );
};
