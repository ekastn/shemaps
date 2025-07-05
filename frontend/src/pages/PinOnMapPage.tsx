import { Button } from "@/components/ui/button";
import { usePlaces } from "@/hooks/usePlaces";
import { useMap } from "@vis.gl/react-google-maps";
import { ArrowLeft, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useTutorial } from "@/contexts/TutorialContext";

export const PinOnMapPage = () => {
    const navigate = useNavigate();
    const map = useMap();
    const { handleLocationSelect, getPlaceFromCoordinates } = usePlaces();
    const [isGeocoding, setIsGeocoding] = useState(false);
    const { advanceTutorial } = useTutorial();

    const handleConfirmPin = async () => {
        if (!map) return;

        const center = map.getCenter();
        if (!center) return;

        setIsGeocoding(true);
        const coords = {
            lat: center.lat(),
            lng: center.lng(),
        };
        const location = await getPlaceFromCoordinates(coords);
        setIsGeocoding(false);

        if (!location) return;
        await handleLocationSelect(location);
        advanceTutorial(9); // Advance tutorial after confirming pin
    };

    return (
        <div className="pointer-events-auto">
            <div className="absolute bottom-0 left-0 right-0 bg-shemaps-main text-white border-b border-gray-200 p-4 z-10 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-medium">Choose location</h2>
                </div>
                <Button
                    onClick={handleConfirmPin}
                    size="sm"
                    className="flex items-center space-x-1 bg-shemaps-dark-shades confirm-pin-tutorial-target"
                    disabled={isGeocoding}
                >
                    {isGeocoding ? "Loading..." : "OK"}
                </Button>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                <div className="bg-shemaps-dark-shades text-white p-2 rounded-full shadow-lg">
                    <MapPin className="w-5 h-5" fill="currentColor" />
                </div>
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-shemaps-dark-shades transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
            </div>
        </div>
    );
};

export default PinOnMapPage;
