import { useParams, useNavigate, useLocation as useRouteLocation } from "react-router";
import { useLocation } from "@/contexts/LocationContext";
import type { Location } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { X, Navigation, Play, Bookmark } from "lucide-react";

interface PlaceInfoPageProps {
  isNewPlace?: boolean;
}

export const PlaceInfoPage = ({ isNewPlace = false }: PlaceInfoPageProps) => {
  useParams(); // We don't need the id right now, but we'll keep the hook call
  const navigate = useNavigate();
  const location = useRouteLocation();
  const { selectedLocation, setSelectedLocation } = useLocation();

  const routeLocation = (location.state?.location as Location) || selectedLocation;

  if (!routeLocation) {
    navigate('/');
    return null;
  }

  const handleClose = () => {
    setSelectedLocation(null);
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      {/* Backdrop with close button at top */}
      <div className="absolute inset-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 pointer-events-auto bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content as bottom sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg pointer-events-auto overflow-hidden">
        {/* Drag handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold mb-1">{routeLocation.name}</h1>
              {isNewPlace && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  New Place
                </span>
              )}
            </div>
            <p className="text-gray-600">{routeLocation.address}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Navigation className="h-4 w-4" />
              <span>Directions</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Play className="h-4 w-4" />
              <span>Start</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 text-blue-600 hover:text-blue-700"
            >
              <Bookmark className="h-4 w-4 fill-current" />
              <span className="text-current">Save</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceInfoPage;
