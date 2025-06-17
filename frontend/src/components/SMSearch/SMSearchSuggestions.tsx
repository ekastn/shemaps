import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Location } from "@/lib/types";

interface SMSearchSuggestionsProps {
    suggestions: Location[];
    onSuggestionSelect: (suggestion: Location) => void;
}

export const SMSearchSuggestions = ({ suggestions, onSuggestionSelect }: SMSearchSuggestionsProps) => {
    if (suggestions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Location not found</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-2">
            {suggestions.map((suggestion) => (
                <Card
                    key={suggestion.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-gray-50 hover:bg-gray-100"
                    onClick={() => onSuggestionSelect(suggestion)}
                >
                    <CardContent className="p-4">
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">
                                {suggestion.name}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                                {suggestion.address}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
