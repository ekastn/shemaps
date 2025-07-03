import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useCallback, useEffect, useState } from "react";

interface SMSearchBarProps {
    value: string;
    placeholder?: string;
    isSearchMode?: boolean;
    onFocus?: () => void;
    onChange?: (value: string) => void;
    onBack?: () => void;
    onClick?: () => void;
    autoFocus?: boolean;
    readOnly?: boolean;
    debounceTimeout?: number;
}

export const SMSearchBar = ({
    value: propValue,
    placeholder = "Where do you want to go?",
    isSearchMode = false,
    onFocus,
    onChange,
    onBack,
    onClick,
    autoFocus = false,
    readOnly = false,
    debounceTimeout = 300,
}: SMSearchBarProps) => {
    const handleIconClick = () => {
        if (isSearchMode && onBack) {
            onBack();
        }
    };

    const [inputValue, setInputValue] = useState(propValue);
    const debouncedValue = useDebounce(inputValue, debounceTimeout);

    // Update local state when prop changes
    useEffect(() => {
        setInputValue(propValue);
    }, [propValue]);

    // Call onChange when debounced value changes
    useEffect(() => {
        if (onChange && debouncedValue !== propValue) {
            onChange(debouncedValue);
        }
    }, [debouncedValue, onChange, propValue]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }, []);

    return (
        <div className="relative" onClick={!isSearchMode ? onClick : undefined}>
            <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isSearchMode ? "cursor-pointer p-1 hover:bg-gray-100  transition-colors" : ""
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
                onClick={!isSearchMode ? onClick : undefined}
                placeholder={placeholder}
                className={`pl-12 rounded-md ${
                    isSearchMode
                        ? "border-gray-300 h-11"
                        : "bg-white shadow-lg border-0 h-12 cursor-pointer"
                }`}
                value={inputValue}
                onChange={handleChange}
                onFocus={onFocus}
                autoFocus={autoFocus}
                readOnly={readOnly}
            />
        </div>
    );
};
