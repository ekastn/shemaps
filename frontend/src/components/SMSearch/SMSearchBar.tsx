import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SMSearchBarProps {
    value: string;
    placeholder?: string;
    isSearchMode?: boolean;
    onFocus?: () => void;
    onChange?: (value: string) => void;
    onBack?: () => void;
    autoFocus?: boolean;
    readOnly?: boolean;
}

export const SMSearchBar = ({
    value,
    placeholder = "Cari tujuan aman Anda...",
    isSearchMode = false,
    onFocus,
    onChange,
    onBack,
    autoFocus = false,
    readOnly = false,
}: SMSearchBarProps) => {
    const handleIconClick = () => {
        if (isSearchMode && onBack) {
            onBack();
        }
    };

    return (
        <div className="relative">
            <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isSearchMode
                        ? "cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                        : ""
                }`}
                onClick={handleIconClick}
            >
                {isSearchMode ? (
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                ) : (
                    <Search className="w-5 h-5 text-gray-400" />
                )}
            </div>
            <Input
                placeholder={placeholder}
                className={`pl-12 ${
                    isSearchMode
                        ? "border-gray-300 rounded-full h-11"
                        : "bg-white shadow-lg border-0 rounded-full h-12 cursor-pointer"
                }`}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onFocus={onFocus}
                autoFocus={autoFocus}
                readOnly={readOnly}
            />
        </div>
    );
};
