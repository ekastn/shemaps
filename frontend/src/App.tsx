import { SMMap } from "./components/maps/SMMap.tsx";
import { SMSearchBar } from "./components/SMSearch/SMSearchBar";
import { useSearch } from "./hooks/useSearch";
import { SMSearchScreen } from "./components/SMSearch/SMSearchScreen";
import { SMPinOnMapScreen } from "./components/SMSearch/PinOnMapScreen";
import { PlaceInfoScreen } from "./components/PlaceInfoScreen";
import { useRef } from "react";

function App() {
    const mapRef = useRef<google.maps.Map | null>(null);

    const {
        searchQuery,
        appMode,
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
        exitPlaceInfo,
        enterPlaceInfo,
        selectLocation,
        setSearchQuery,
        setCurrentCoordinate,
    } = useSearch();

    const setMapReference = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const renderOverlay = () => {
        switch (appMode) {
            case "placeInfo":
                if (!selectedLocation) return null;
                return (
                    <PlaceInfoScreen
                        location={selectedLocation}
                        onClose={exitPlaceInfo}
                    />
                );

            case "map":
                return (
                    <div className="absolute bottom-6 left-4 right-4 z-10">
                        <SMSearchBar
                            value={selectedLocation ? selectedLocation.name : ""}
                            onFocus={enterSearchMode}
                            readOnly={true}
                            onClick={() => selectedLocation && showPlaceInfo()}
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
                            onSearchQueryChange={setSearchQuery}
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
                        onCoordinateSelect={setCurrentCoordinate}
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
                    markerCoordinate={selectedLocation?.coordinate}
                    className={appMode === "search" ? "pointer-events-none" : ""}
                    setMapRef={setMapReference}
                />
            </div>

            {renderOverlay()}

        </main>
    );
}

export default App;

