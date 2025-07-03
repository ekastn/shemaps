import { MapPin, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Location } from "@/lib/types";

interface SMSearchSuggestionsProps {
    suggestions: Location[];
    onSuggestionSelect: (suggestion: Location) => void;
}

export const SMSearchSuggestions = ({
    suggestions,
    onSuggestionSelect,
}: SMSearchSuggestionsProps) => {
    if (suggestions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Location not found</p>
            </div>
        );
    }

    return (
        <>
            {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border-b last:border-b-0">
                    <button
                        className="w-full text-left p-4 hover:bg-gray-50 flex items-center gap-3"
                        onClick={() => onSuggestionSelect(suggestion)}
                    >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">{suggestion.name}</p>
                            <p className="text-xs text-gray-600">{suggestion.address}</p>
                        </div>
                    </button>
                </div>
            ))}
        </>
    );
};
