import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { useMap } from "@vis.gl/react-google-maps";
import { Navigation, Shield, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";


interface PlaceInfoPageProps {
    isNewPlace?: boolean;
}

export const PlaceInfoPage = ({ isNewPlace = false }: PlaceInfoPageProps) => {
    const navigate = useNavigate();
    const { selectedLocation, setSelectedLocation } = useLocation();
    const { advanceTutorial } = useTutorial();

    if (!selectedLocation) {
        navigate("/");
        return;
    }

    const map = useMap();

    useEffect(() => {
        if (map?.panTo && selectedLocation?.coordinate) {
            map.panTo(selectedLocation.coordinate);
            map.setZoom(18);
        }
    }, [selectedLocation, map]);

    const handleClose = () => {
        setSelectedLocation(null);
        navigate("/");
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-shemaps-main rounded-t-2xl shadow-lg pointer-events-auto overflow-hidden">
            <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-4 text-white">
                    <div className="flex items-start justify-between">
                        <h1 className="text-2xl font-bold mb-1">{selectedLocation.name}</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            aria-label="Close"
                            className="pointer-events-auto hover:bg-white"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="text-shemaps-light-shades">{selectedLocation.address}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-2 rounded-xl bg-shemaps-dark-shades text-white hover:bg-shemaps-light-accent focus-visible:ring-pink-500 directions-button-tutorial-target"
                        onClick={() => {
                            navigate("/directions");
                            advanceTutorial(10);
                        }}
                    >
                        <Navigation className="h-4 w-4" />
                        <span>Directions</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-2 bg-shemaps-light-shades rounded-xl text-red-600 hover:text-red-700 cursor-pointer report-button-tutorial-target"
                        onClick={() => {
                            navigate("/report");
                            advanceTutorial(11);
                        }}
                    >
                        <Shield className="h-4 w-4" />
                        <span className="text-current">Report</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PlaceInfoPage;
