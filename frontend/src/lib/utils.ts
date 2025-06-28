import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getRouteColor = (index: number): string => {
    const colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#673AB7"];
    return colors[index % colors.length];
};
