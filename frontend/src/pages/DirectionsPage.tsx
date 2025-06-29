import { useNavigate } from "react-router";
import { useLocation } from "@/contexts/LocationContext";
import { useDirections } from "@/contexts/DirectionsContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleDot, MapPin, MoreVertical, ArrowUpDown, X } from "lucide-react";
import { useEffect } from "react";
import { getRouteColor } from "@/lib/utils";
import { useMap } from "@vis.gl/react-google-maps";

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
            console.log("Calculating route from direction page");
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
            <div className="relative z-10 p-4">
                {/* Top component */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-grow ml-4">
                            <div className="flex items-center space-x-2">
                                <CircleDot className="h-4 w-4 text-blue-500" />
                                <p className="text-sm font-medium text-blue-700">Your location</p>
                            </div>
                            <div className="border-l-2 border-gray-300 h-4 ml-2"></div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-red-500" />
                                <p className="text-sm font-medium text-gray-800">
                                    {selectedLocation.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {routes.length > 1 && (
                    <div className="mt-2 flex overflow-x-auto space-x-2 p-2">
                        {routes.map((route, index) => (
                            <button
                                key={index}
                                onClick={() => handleRouteSelect(index)}
                                className={`px-3 py-2 rounded-full text-sm whitespace-nowrap bg-white shadow-md transition-all ${
                                    selectedRouteIndex === index
                                        ? "border-2 border-blue-500 text-blue-800"
                                        : "border border-gray-200 text-gray-700"
                                }`}
                                style={{
                                    border: `${
                                        selectedRouteIndex === index ? "2px" : "1px"
                                    } solid ${getRouteColor(route.safety_level)}`,
                                }}
                            >
                                Route {index + 1} • {route.legs[0]?.distance?.text} •{" "}
                                {route.legs[0]?.duration?.text}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-10 max-h-[60vh] overflow-hidden">
                <div className="p-4">
                    {routes.length > 0 && (
                        <div className="space-y-4">
                            <div className="p-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-lg">
                                        {routes[selectedRouteIndex].legs[0].distance?.text} ({" "}
                                        {routes[selectedRouteIndex].legs[0].duration?.text})
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleBack}
                                        className="flex-shrink-0 bg-gray-100"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-3 max-h-[20vh] overflow-y-auto">
                                {routes[selectedRouteIndex].legs[0].steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div
                                                className="text-sm"
                                                dangerouslySetInnerHTML={{
                                                    __html: step.html_instructions,
                                                }}
                                            />
                                            {step.distance && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {step.distance.text} • {step.duration?.text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg">Loading directions...</div>
                </div>
            )}

            {error && <div className="bg-red-100 text-red-800 p-4">Error: {error}</div>}
        </>
    );
};

export default DirectionsPage;
