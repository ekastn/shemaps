import { MapPin, Navigation, Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { SMSearchSuggestions } from "./SMSearchSuggestions";
import type { Location } from "@/lib/types";
import { Button } from "../ui/button";

interface SearchResultsProps {
    searchQuery: string;
    recentSearches: Location[];
    filteredSuggestions: Location[];
    isLoading: boolean;
    error: string | null;
    onSuggestionSelect: (suggestion: Location) => Promise<void>;
    className?: string;
}

export const SearchResults = ({
    searchQuery,
    recentSearches,
    filteredSuggestions,
    isLoading,
    error,
    onSuggestionSelect,
    className,
}: SearchResultsProps) => {
    if (isLoading) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="animate-pulse">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <button
                    className="mt-2 text-sm text-blue-500 hover:underline"
                    onClick={() => window.location.reload()}
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <Card className={`shadow-lg rounded-md py-2 overflow-y-auto bg-shemaps-light-shades ${className}`}>
            <CardContent className="p-0">
                {searchQuery === "" ? (
                    <div>
                        <div className="px-4 py-2 text-sm font-medium text-gray-500">Recent</div>
                        <SMSearchSuggestions
                            suggestions={recentSearches}
                            onSuggestionSelect={onSuggestionSelect}
                        />
                    </div>
                ) : (
                    <SMSearchSuggestions
                        suggestions={filteredSuggestions}
                        onSuggestionSelect={onSuggestionSelect}
                    />
                )}
            </CardContent>
        </Card>
    );
};
