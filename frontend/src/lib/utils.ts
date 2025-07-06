import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Coordinate } from "@/lib/types";

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

export const areCoordinatesClose = (
    coord1: Coordinate,
    coord2: Coordinate,
    tolerance: number = 0.000001
): boolean => {
    return (
        Math.abs(coord1.lat - coord2.lat) < tolerance &&
        Math.abs(coord1.lng - coord2.lng) < tolerance
    );
};
