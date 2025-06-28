import { Button } from "@/components/ui/button";
import { usePlaces } from "@/hooks/usePlaces";
import { useMap } from "@vis.gl/react-google-maps";
import { ArrowLeft, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export const PinOnMapPage = () => {
    const navigate = useNavigate();
    const map = useMap();
    const { handleLocationSelect, getPlaceFromCoordinates } = usePlaces();
    const [isGeocoding, setIsGeocoding] = useState(false);

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
    };

    return (
        <>
            <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="font-medium">Choose location</h2>
                </div>
                <Button
                    onClick={handleConfirmPin}
                    size="sm"
                    className="flex items-center space-x-1"
                    disabled={isGeocoding}
                >
                    {isGeocoding ? "Loading..." : "OK"}
                </Button>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20 pointer-events-none">
                <MapPin className="w-8 h-8 text-red-500" />
            </div>
        </>
    );
};

export default PinOnMapPage;

