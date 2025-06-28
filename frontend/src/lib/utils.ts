import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getRouteColor = (safetyLevel: string): string => {
    switch (safetyLevel) {
        case "SAFE":
            return "#34A853";
        case "CAUTIOUS":
            return "#FBBC05"; 
        case "DANGEROUS":
            return "#EA4335"; 
        default:
            return "#4285F4"; 
    }
};
