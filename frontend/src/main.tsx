import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { APIProvider } from "@vis.gl/react-google-maps";
import { loadGoogleMapsScript } from "./lib/utils/googleMapsLoader";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Load the Google Maps script with Places library
loadGoogleMapsScript({ 
  googleMapsApiKey: apiKey,
  libraries: ['places']
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <APIProvider apiKey={apiKey} libraries={["places"]}>
            <App />
        </APIProvider>
    </StrictMode>
);
