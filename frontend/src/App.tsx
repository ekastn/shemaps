import { APIProvider } from "@vis.gl/react-google-maps";
import { SMMap } from "./components/maps/SMMap.tsx";

function App() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    return (
        <APIProvider apiKey={apiKey}>
            <main className="w-screen h-screen">
                <SMMap center={{ lat: 37.7749, lng: -122.4194 }} zoom={10} />
            </main>
        </APIProvider>
    );
}

export default App;
