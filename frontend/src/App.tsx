import { Routes, Route } from "react-router";
import {
    HomePage,
    SearchPage,
    PinOnMapPage,
    PlaceInfoPage,
    DirectionsPage,
    PanicModePage,
} from "@/pages";
import { ReportLocationPage } from "./pages/ReportLocationPage";
import { MainLayout } from "./components/core/MainLayout";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/pin" element={<PinOnMapPage />} />
                <Route path="/place/:id" element={<PlaceInfoPage />} />
                <Route path="/report" element={<ReportLocationPage />} />
                <Route path="/directions" element={<DirectionsPage />} />
            </Route>
            <Route path="/panic" element={<PanicModePage />} />
        </Routes>
    );
}
