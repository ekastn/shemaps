import type { Location, Coordinate, PlaceResult } from "@/lib/types";
import { MOCK_LOCATIONS } from "@/lib/constants";
import { waitForGoogleMapsToLoad } from "@/lib/utils/googleMapsLoader";

export const searchLocations = async (query: string): Promise<Location[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return MOCK_LOCATIONS.filter(
    location =>
      location.name.toLowerCase().includes(lowercaseQuery) ||
      location.address.toLowerCase().includes(lowercaseQuery)
  );
};

export const getRecentLocations = async (limit: number = 5): Promise<Location[]> => {
  // In a real app, this would fetch from local storage or user preferences API
  return MOCK_LOCATIONS.slice(0, limit);
};

export const getLocationById = async (id: number): Promise<Location | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const location = MOCK_LOCATIONS.find(location => location.id === id);
  return location || null;
};

interface CreateLocationParams {
  name: string;
  address: string;
  coordinates: Coordinate;
}

export const createCustomLocation = async (data: CreateLocationParams): Promise<Location> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a unique ID (in a real app, this would be done by the backend)
  const id = Date.now();
  
  // Create a new location object
  const newLocation: Location = {
    id,
    name: data.name,
    type: "custom",
    address: data.address,
    icon: "map-pin",
    safetyRating: "Safe", // Default safety rating
    coordinate: data.coordinates
  };
  
  return newLocation;
};

export const convertPlaceToLocation = async (
  place: PlaceResult,
  coordinate?: Coordinate
): Promise<Location> => {
  // Generate a unique ID (in a real app, this would be done by the backend)
  const id = Date.now();
  
  // Determine the location type based on the place types
  let locationType: Location["type"] = "custom";
  if (place.types) {
    if (place.types.includes("hospital")) locationType = "hospital";
    else if (place.types.includes("police")) locationType = "police";
    else if (place.types.includes("shopping_mall")) locationType = "mall";
    else if (place.types.includes("transit_station")) locationType = "transport";
    else if (place.types.includes("local_government_office")) locationType = "government";
    else if (place.types.includes("school") || place.types.includes("university")) locationType = "education";
  }
  
  // Create the location object
  const newLocation: Location = {
    id,
    name: place.structured_formatting?.main_text || place.description,
    type: locationType,
    address: place.structured_formatting?.secondary_text || "",
    icon: getIconForType(locationType),
    safetyRating: "Safe", // Default safety rating
    placeId: place.place_id,
    coordinate: coordinate
  };
  
  return newLocation;
};

export const getCoordinatesForPlaceId = async (placeId: string): Promise<Coordinate | null> => {
  try {
    // Wait for Google Maps to be loaded
    await waitForGoogleMapsToLoad();
    
    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ placeId }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.error("Geocoding failed:", status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error in getCoordinatesForPlaceId:", error);
    return null;
  }
};

export const getAddressForCoordinates = async (coordinate: Coordinate): Promise<string> => {
  try {
    // Wait for Google Maps to be loaded
    await waitForGoogleMapsToLoad();
    
    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ location: coordinate }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          console.error("Reverse geocoding failed:", status);
          resolve(`Location at ${coordinate.lat.toFixed(6)}, ${coordinate.lng.toFixed(6)}`);
        }
      });
    });
  } catch (error) {
    console.error("Error in getAddressForCoordinates:", error);
    return `Location at ${coordinate.lat.toFixed(6)}, ${coordinate.lng.toFixed(6)}`;
  }
};

/**
 * Get appropriate icon for location type
 */
const getIconForType = (type: Location["type"]): string => {
  switch (type) {
    case "hospital": return "hospital";
    case "police": return "police";
    case "mall": return "building";
    case "transport": return "train";
    case "government": return "building";
    case "meeting": return "mappin";
    case "education": return "building";
    case "custom": 
    default: return "map-pin";
  }
};
