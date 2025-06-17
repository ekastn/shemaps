import { APIProvider } from "@vis.gl/react-google-maps";
import { SMMap } from "./components/maps/SMMap.tsx";
import { Button } from "./components/ui/button.tsx";
import { SMSearchBar } from "./components/SMSearch/SMSeachBar";
import { useSearch } from "./hooks/useSearch";
import { SMSearchScreen } from "./components/SMSearch/SMSearchScreen";

function App() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const {
        searchQuery,
        searchMode,
        selectedLocation,
        recentSearches,
        filteredSuggestions,
        enterSearchMode,
        exitSearchMode,
        selectLocation,
        updateSearchQuery,
    } = useSearch();

    return (
        // <APIProvider apiKey={apiKey}>
        <main className="w-screen h-screen bg-cyan-400">
            {searchMode === "map" ? (
                <div className="absolute top-4 left-4 right-4 z-10">
                    <SMSearchBar
                        value={selectedLocation ? selectedLocation.name : ""}
                        onFocus={enterSearchMode}
                        readOnly={true}
                    />
                </div>
            ) : (
                <SMSearchScreen
                    searchQuery={searchQuery}
                    recentSearches={recentSearches}
                    filteredSuggestions={filteredSuggestions}
                    onSearchQueryChange={updateSearchQuery}
                    onBack={exitSearchMode}
                    onSuggestionSelect={selectLocation}
                />
            )}
            {/* <SMMap center={{ lat: 37.7749, lng: -122.4194 }} zoom={10} /> */}
        </main>
        // {/* </APIProvider> */}
    );
}

export default App;
