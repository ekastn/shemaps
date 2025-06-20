import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { APIProvider } from "@vis.gl/react-google-maps";
import { LocationProvider } from "./contexts/LocationContext.tsx";
import { DirectionsProvider } from "./contexts/DirectionsContext.tsx";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <APIProvider apiKey={apiKey} libraries={["places"]}>
        <LocationProvider>
          <DirectionsProvider>
            <App />
          </DirectionsProvider>
        </LocationProvider>
      </APIProvider>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
