// This file handles loading Google Maps API script for use-places-autocomplete
// Based on https://github.com/wellyshen/use-places-autocomplete#load-the-library

interface LoadScriptOptions {
  googleMapsApiKey: string;
  libraries?: string[];
}

/**
 * Load the Google Maps API script for use with use-places-autocomplete
 * This creates a script tag that loads Google Maps with the Places library
 */
export const loadGoogleMapsScript = ({ googleMapsApiKey, libraries = ['places'] }: LoadScriptOptions): void => {
  // Skip if already loaded
  if (window.google?.maps) return;
  
  // Skip if already loading (script tag exists)
  if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) return;
  
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=${libraries.join(',')}&callback=Function.prototype`;
  script.async = true;
  script.defer = true;
  
  document.head.appendChild(script);
};

/**
 * Check if Google Maps API with Places library is loaded
 */
export const isGoogleMapsLoaded = (): boolean => {
  return !!window.google?.maps?.places;
};

/**
 * Returns a promise that resolves when Google Maps API is loaded
 */
export const waitForGoogleMapsToLoad = (): Promise<void> => {
  if (isGoogleMapsLoaded()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);
  });
};
