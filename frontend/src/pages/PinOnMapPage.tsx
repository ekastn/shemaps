import { useNavigate } from "react-router";
import { useLocation } from "@/contexts/LocationContext";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PinOnMapPage = () => {
  const navigate = useNavigate();
  const { setSelectedLocation, addToRecentSearches } = useLocation();

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    addToRecentSearches(location);
    navigate(`/place/new`, { state: { location } });
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="font-medium">Choose location</h2>
        </div>
        <Button
          onClick={handleLocationSelect}
          size="sm"
          className="flex items-center space-x-1"
        >
          OK
        </Button>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20 pointer-events-none">
        <MapPin className="w-8 h-8 text-red-500" />
      </div>
    </>
  );
};

export default PinOnMapPage;
