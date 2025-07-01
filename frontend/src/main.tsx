import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { APIProvider } from "@vis.gl/react-google-maps";
import { LocationProvider } from "./contexts/LocationContext.tsx";
import { DirectionsProvider } from "./contexts/DirectionsContext.tsx";
import { SafetyReportProvider } from "./contexts/SafetyReportContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext.tsx"; // Import LoadingProvider and useLoading
import SplashScreen from "./components/SplashScreen.tsx";
import { RealtimeProvider } from "./contexts/RealtimeContext.tsx";

declare global {
    interface Window {
        env: {
            VITE_API_BASE_URL: string;
            VITE_GOOGLE_MAPS_API_KEY: string;
            VITE_ALLOWED_ORIGINS: string;
            VITE_WS_URL: string;
            VITE_GOOGLE_MAPS_ID: string;
        };
    }
}

const apiKey = window.env?.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function AppWrapper() {
    const { isAppLoading, setMapsLoaded } = useLoading();

    return (
        <APIProvider apiKey={apiKey} libraries={["places"]} onLoad={() => setMapsLoaded(true)}>
            <AuthProvider>
                <RealtimeProvider>
                    <LocationProvider>
                        <DirectionsProvider>
                            <SafetyReportProvider>
                                {isAppLoading ? <SplashScreen /> : <App />}
                            </SafetyReportProvider>
                        </DirectionsProvider>
                    </LocationProvider>
                </RealtimeProvider>
            </AuthProvider>
        </APIProvider>
    );
}

const router = createBrowserRouter([
    {
        path: "*",
        element: (
            <LoadingProvider>
                <AppWrapper />
            </LoadingProvider>
        ),
    },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
