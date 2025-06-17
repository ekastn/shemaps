import { SMSearchBar } from "./SMSeachBar";
import { SMSearchSuggestions } from "./SMSearchSuggestions";
import type { Location } from "@/lib/types";

interface SMSearchScreenProps {
    searchQuery: string;
    recentSearches: Location[];
    filteredSuggestions: Location[];
    onSearchQueryChange: (query: string) => void;
    onBack: () => void;
    onSuggestionSelect: (suggestion: Location) => void;
}

export const SMSearchScreen = ({
    searchQuery,
    recentSearches,
    filteredSuggestions,
    onSearchQueryChange,
    onBack,
    onSuggestionSelect,
}: SMSearchScreenProps) => {
    return (
        <div className="h-screen w-full bg-white flex flex-col">
            <div className="bg-white border-b border-gray-200 p-4">
                <SMSearchBar
                    value={searchQuery}
                    onChange={onSearchQueryChange}
                    onBack={onBack}
                    isSearchMode={true}
                    autoFocus={true}
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {searchQuery === "" ? (
                    <SMSearchSuggestions
                        suggestions={recentSearches}
                        onSuggestionSelect={onSuggestionSelect}
                    />
                ) : (
                    <SMSearchSuggestions
                        suggestions={filteredSuggestions}
                        onSuggestionSelect={onSuggestionSelect}
                    />
                )}
            </div>
        </div>
    );
};
