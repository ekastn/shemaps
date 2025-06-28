import { useNavigate } from "react-router";
import { useLocation } from "@/contexts/LocationContext";
import { useDirections } from "@/contexts/DirectionsContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { getRouteColor } from "@/lib/utils";

export const DirectionsPage = () => {
    const navigate = useNavigate();
    const { currentCoordinate, selectedLocation } = useLocation();

    const { routes, calculateRoute, isLoading, error, selectedRouteIndex, setSelectedRouteIndex } =
        useDirections();

    console.log("error:", error);

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
    }, [currentCoordinate, selectedLocation, calculateRoute]);

    if (!selectedLocation) {
        navigate("/");
        return null;
    }

    const handleBack = () => {
        navigate(-1);
    };

    const handleRouteSelect = (index: number) => {
        setSelectedRouteIndex(index);
    };

    return (
        <>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-white p-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBack}
                        className="flex-shrink-0"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <p className="text-sm">{selectedLocation.name}</p>
                </div>
                {routes && routes.length > 1 && (
                    <div className="flex overflow-x-auto p-2 space-x-2">
                        {routes.map((route, index) => (
                            <button
                                key={index}
                                onClick={() => handleRouteSelect(index)}
                                className={`px-3 py-2 rounded-full text-sm whitespace-nowrap ${
                                    selectedRouteIndex === index
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-white text-gray-700"
                                }`}
                                style={{
                                    border: `2px solid ${getRouteColor(route.safety_level)}`,
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
                            Route Summary
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">
                                            {routes[selectedRouteIndex].legs[0].distance?.text}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {routes[selectedRouteIndex].legs[0].duration?.text}
                                        </div>
                                    </div>
                                    <Button size="sm">Start</Button>
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

