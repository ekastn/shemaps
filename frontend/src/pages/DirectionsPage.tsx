import { Button } from "@/components/ui/button";
import { useDirections } from "@/contexts/DirectionsContext";
import { useLocation } from "@/contexts/LocationContext";
import { getRouteColor } from "@/lib/utils";
import { useMap } from "@vis.gl/react-google-maps";
import { CircleDot, MapPin, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const DirectionsPage = () => {
    const navigate = useNavigate();
    const { currentCoordinate, selectedLocation } = useLocation();

    const {
        routes,
        calculateRoute,
        isLoading,
        error,
        selectedRouteIndex,
        setSelectedRouteIndex,
        clearDirections,
    } = useDirections();

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
        }
    }, [map, routes, selectedRouteIndex]);

    if (!selectedLocation) {
        clearDirections();
        navigate("/");
        return null;
    }

    const handleBack = () => {
        clearDirections();
        navigate(-1);
    };

    const handleRouteSelect = (index: number) => {
        setSelectedRouteIndex(index);
    };

    return (
        <>
            {/* Header */}
            <div className="relative z-10 p-4 bg-white  rounded-b-2xl">
                {/* Top component */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-grow ml-4">
                            <div className="flex items-center space-x-4">
                                <CircleDot className="size-6 text-blue-500" />
                                <p className="text-lg font-medium text-blue-700">Your location</p>
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
            </div>

            {routes.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg pointer-events-auto overflow-hidden">
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        <div>
                            <div className="flex items-start justify-between">
                                <h1 className="text-2xl font-bold mb-1">
                                    {routes[selectedRouteIndex].legs[0].distance?.text} ({" "}
                                    {routes[selectedRouteIndex].legs[0].duration?.text})
                                </h1>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleBack}
                                    aria-label="Close"
                                    className="pointer-events-auto bg-white/80 backdrop-blur-sm hover:bg-white"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <p className="text-gray-600">{routes[selectedRouteIndex].summary}</p>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg">Finding routes...</div>
                </div>
            )}

            {error && <div className="bg-red-100 text-red-800 p-4">Error: {error}</div>}
        </>
    );
};

export default DirectionsPage;
