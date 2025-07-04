import { SMSearchBar } from "@/components/SMSearch/SMSearchBar";
import { SearchResults } from "@/components/SMSearch/SearchResults";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { usePlaces } from "@/hooks/usePlaces";
import { type Location } from "@/lib/types";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { useTutorial } from "@/components/core/Tutorial";

export const SearchPage = () => {
    const navigate = useNavigate();
    const { recentSearches } = useLocation();
    const { advanceTutorial } = useTutorial();
    const {
        searchQuery,
        setSearchQuery,
        filteredSuggestions,
        isSearchLoading,
        searchError,
        handleLocationSelect,
    } = usePlaces();

    const handleSuggestionSelect = async (location: Location) => {
        await handleLocationSelect(location);
        advanceTutorial(8); // Advance tutorial after selecting a search result
    };

    return (
        <div className="absolute inset-0 z-10 pointer-events-auto">
            <div className="h-full w-full flex flex-col">
                <div className="bg-white p-4 rounded-b-2xl">
                    <div className="sticky top-0 z-10 mb-2">
                        <SMSearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onBack={() => navigate(-1)}
                            isSearchMode={true}
                            autoFocus={true}
                            className="search-input-tutorial-target"
                        />
                    </div>

                    <div className="border-b border-gray-200">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-12 rounded-md border-gray-300 choose-on-map-tutorial-target"
                            onClick={() => { navigate("/pin"); advanceTutorial(7); }}
                        >
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <span>Choose on Map</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1 mt-4 overflow-y-auto p-2">
                    <SearchResults
                        searchQuery={searchQuery}
                        recentSearches={recentSearches}
                        filteredSuggestions={filteredSuggestions}
                        isLoading={isSearchLoading}
                        error={searchError}
                        onSuggestionSelect={handleSuggestionSelect}
                        className="search-result-tutorial-target"
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
