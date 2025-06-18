import { MapPin } from "lucide-react";
import { SMSearchBar } from "./SMSearchBar";
import { SearchResults } from "./SearchResults";
import { Button } from "../ui/button";
import type { Location, PlaceResult } from "@/lib/types";

interface SMSearchScreenProps {
    searchQuery: string;
    recentSearches: Location[];
    filteredSuggestions: Location[];
    isLoading?: boolean;
    error?: string | null;
    onSearchQueryChange: (query: string) => void;
    onBack: () => void;
    onSuggestionSelect: (suggestion: Location) => void;
    onChooseOnMap: () => void;
}

export const SMSearchScreen = ({
    searchQuery,
    recentSearches,
    filteredSuggestions,
    isLoading = false,
    error = null,
    onSearchQueryChange,
    onBack,
    onSuggestionSelect,
    onChooseOnMap,
}: SMSearchScreenProps) => {
    return (
        <div className="h-full w-full bg-white flex flex-col">
            <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
                <SMSearchBar
                    value={searchQuery}
                    onChange={onSearchQueryChange}
                    onBack={onBack}
                    isSearchMode={true}
                    autoFocus={true}
                />
            </div>

            <div className="bg-white p-3 border-b border-gray-200">
                <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-full border-gray-300"
                    onClick={onChooseOnMap}
                >
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>Choose on Map</span>
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <SearchResults
                    searchQuery={searchQuery}
                    recentSearches={recentSearches}
                    filteredSuggestions={filteredSuggestions}
                    isLoading={isLoading}
                    error={error}
                    onSuggestionSelect={onSuggestionSelect}
                />
            </div>
        </div>
    );
};
