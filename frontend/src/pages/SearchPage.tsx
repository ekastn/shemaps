import { useNavigate } from "react-router";
import { SMSearchBar } from "@/components/SMSearch/SMSearchBar";
import { SearchResults } from "@/components/SMSearch/SearchResults";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { usePlaces } from "@/hooks/usePlaces";

export const SearchPage = () => {
  const navigate = useNavigate();
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
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-auto">
      <div className="h-full w-full bg-white flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <SMSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onBack={() => navigate(-1)}
            isSearchMode={true}
            autoFocus={true}
          />
        </div>

        <div className="bg-white p-3 border-b border-gray-200">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-12 rounded-full border-gray-300"
            onClick={() => navigate('/pin')}
          >
            <MapPin className="w-5 h-5 text-gray-500" />
            <span>Choose on Map</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SearchResults
            searchQuery={searchQuery}
            recentSearches={[]} // Will be added back when we implement recent searches in usePlaces
            filteredSuggestions={filteredSuggestions}
            isLoading={isSearchLoading}
            error={searchError}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
