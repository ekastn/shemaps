import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDirections } from "@/contexts/DirectionsContext";
import { useLocation } from "@/contexts/LocationContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { useMap } from "@vis.gl/react-google-maps";
import { CircleDot, MapPin, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const DirectionsPage = () => {
    const navigate = useNavigate();
    const { currentCoordinate, selectedLocation } = useLocation();
    const { advanceTutorial } = useTutorial();

    const { routes, calculateRoute, isLoading, error, selectedRouteIndex, clearDirections } =
        useDirections();

    // Calculate route when component mounts or travel mode changes
    useEffect(() => {
        if (currentCoordinate && selectedLocation?.coordinate) {
            calculateRoute(
                { lat: currentCoordinate.lat, lng: currentCoordinate.lng },
                selectedLocation.coordinate
            );
        } else {
            navigate(-1);
        }
    }, [currentCoordinate, selectedLocation, calculateRoute, navigate]);

    const map = useMap();

    useEffect(() => {
        if (map && routes.length > 0) {
            const bounds = new google.maps.LatLngBounds(
                (routes[selectedRouteIndex].bounds as any).southwest,
                (routes[selectedRouteIndex].bounds as any).northeast
            );
            map.fitBounds(bounds);
            advanceTutorial(13); // Advance tutorial after route is displayed
        }
    }, [map, routes, selectedRouteIndex, advanceTutorial]);

    if (!selectedLocation) {
        clearDirections();
        navigate("/");
        return null;
    }

    const handleBack = () => {
        clearDirections();
        navigate(-1);
    };

    return (
        <>
            <div className="absolute top-0 inset-x-0 bg-shemaps-main rounded-b-2xl shadow-lg z-10 pointer-events-auto">
                <div className="relative z-10 p-4 rounded-b-2xl">
                    <div className="bg-shemaps-light-shades rounded-xl shadow-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-grow ml-4">
                                <div className="flex items-center space-x-4">
                                    <CircleDot className="size-6 text-blue-500" />
                                    <p className="text-lg font-medium text-blue-700">
                                        Your location
                                    </p>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex items-center space-x-4">
                                    <MapPin className="size-6 text-red-500" />
                                    <p className="text-lg font-medium text-gray-800">
                                        {selectedLocation.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isLoading && (
                        <div className="mt-4 bg-shemaps-light-shades p-4 rounded-md">Finding routes...</div>
                    )}
                    {error && (
                        <div className="mt-4 bg-shemaps-dark-accent text-red-800 p-4 rounded-md">
                            Cannot find routes
                        </div>
                    )}
                </div>
            </div>

            {routes.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="p-6 max-h-[60vh] bg-shemaps-main overflow-y-auto rounded-t-3xl shadow-lg pointer-events-auto overflow-hidden">
                        <div className="route-info-tutorial-target">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                    <h1 className="text-2xl text-white font-bold mb-1 mr-2">
                                        {routes[selectedRouteIndex].legs[0].distance?.text}
                                    </h1>
                                    <div
                                        className={`px-3 py-1 rounded-md text-sm font-medium
                                    ${
                                        routes[selectedRouteIndex].safety_level === "SAFE"
                                            ? "bg-green-100 text-green-800"
                                            : routes[selectedRouteIndex].safety_level === "CAUTIOUS"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-red-100 text-red-800"
                                    }`}
                                    >
                                        {routes[selectedRouteIndex].safety_level}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleBack}
                                    aria-label="Close"
                                    className="pointer-events-auto text-white hover:bg-white"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <p className="text-white">{routes[selectedRouteIndex].summary}</p>
                            <p className="text-white">
                                {routes[selectedRouteIndex].legs[0].duration?.text}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DirectionsPage;
