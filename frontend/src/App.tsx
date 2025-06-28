import { Routes, Route } from "react-router";
import { SMMap } from "@/components/maps/SMMap";
import { useLocation } from "@/contexts/LocationContext";
import { HomePage, SearchPage, PinOnMapPage, PlaceInfoPage, DirectionsPage } from "@/pages";

export default function App() {
  const { currentCoordinate, selectedLocation } = useLocation();
  const defaultCenter = { lat: -6.2088, lng: 106.8456 };

  return (
    <div className="relative w-full h-screen">
      {/* Main Map */}
      <SMMap
        zoom={15}
        center={currentCoordinate || defaultCenter}
        markerCoordinate={selectedLocation?.coordinate}
        className="absolute inset-0"
      />

      {/* Route-based Pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/pin" element={<PinOnMapPage />} />
        <Route path="/place/:id" element={<PlaceInfoPage />} />
        <Route path="/place/new" element={<PlaceInfoPage isNewPlace={true} />} />
        <Route path="/directions" element={<DirectionsPage />} />
      </Routes>
    </div>
  );
}
