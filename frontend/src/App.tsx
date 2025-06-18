import { SMMap } from "./components/maps/SMMap.tsx";
import { SMSearchBar } from "./components/SMSearch/SMSearchBar";
import { useSearch } from "./hooks/useSearch";
import { SMSearchScreen } from "./components/SMSearch/SMSearchScreen";
import { SMPinOnMapScreen } from "./components/SMSearch/PinOnMapScreen";
import { useRef } from "react";

function App() {
    const mapRef = useRef<google.maps.Map | null>(null);

    const {
        searchQuery,
        searchMode,
        selectedLocation,
        recentSearches,
        filteredSuggestions,
        currentCoordinate,
        isLoading,
        error,
        enterSearchMode,
        exitSearchMode,
        enterPinMode,
        exitPinMode,
        selectLocation,
        updateSearchQuery,
        updateCoordinate,
    } = useSearch();

    // const handleMapClick = (event: google.maps.MapMouseEvent) => {
    //     console.log("Map clicked:", event);
    //     if (searchMode === "pin" && event.latLng) {
    //         const lat = event.latLng.lat();
    //         const lng = event.latLng.lng();
    //         updateCoordinates({ lat, lng });
    //     }
    // };

    const setMapReference = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const renderOverlay = () => {
        switch (searchMode) {
            case "map":
                return (
                    <div className="absolute bottom-6 left-4 right-4 z-10">
                        <SMSearchBar
                            value={selectedLocation ? selectedLocation.name : ""}
                            onFocus={enterSearchMode}
                            readOnly={true}
                        />
                    </div>
                );
            case "search":
                return (
                    <div className="absolute inset-0 z-10 pointer-events-auto">
                        <SMSearchScreen
                            searchQuery={searchQuery}
                            recentSearches={recentSearches}
                            filteredSuggestions={filteredSuggestions}
                            isLoading={isLoading}
                            error={error}
                            onSearchQueryChange={updateSearchQuery}
                            onBack={exitSearchMode}
                            onSuggestionSelect={selectLocation}
                            onChooseOnMap={enterPinMode}
                        />
                    </div>
                );
            case "pin":
                return (
                    <SMPinOnMapScreen
                        onBack={exitPinMode}
                        onCoordinateSelect={updateCoordinate}
                        coordinate={currentCoordinate}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <main className="w-screen h-screen relative">
            <div className="absolute inset-0">
                <SMMap
                    center={currentCoordinate}
                    zoom={14}
                    onMapLoad={setMapReference}
                    // onClick={handleMapClick}
                    className={searchMode === "search" ? "pointer-events-none" : ""}
                />
            </div>

            {renderOverlay()}
        </main>
    );
}

export default App;

