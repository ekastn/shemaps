import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "@/contexts/LocationContext";
import { useRealtime } from "@/contexts/RealtimeContext";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import { Home, Siren } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const PanicModePage = () => {
    const navigate = useNavigate();
    const { resolvePanic } = useRealtime();
    const { currentCoordinate } = useLocation();
    const { getPlaceFromCoordinates } = usePlacesSearch();
    const [locationName, setLocationName] = useState("Getting location...");

    useEffect(() => {
        if (currentCoordinate) {
            const fetchLocationName = async () => {
                const place = await getPlaceFromCoordinates(currentCoordinate);
                if (place) {
                    setLocationName(place.name);
                } else {
                    setLocationName("Location not found");
                }
            };
            fetchLocationName();
        }
    }, [currentCoordinate, getPlaceFromCoordinates]);

    const handleCancel = () => {
        resolvePanic();
        navigate("/");
    };

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-[#D93F8A]">
            <div className="flex flex-col items-center justify-center flex-grow text-white">
                <div className="p-6 bg-white/20 rounded-full">
                    <Siren size={64} className="text-white" />
                </div>
                <h1 className="mt-4 text-4xl font-bold">PANIC MODE</h1>
                <p className="text-2xl">AKTIF</p>
            </div>
            <div className="p-6 bg-white w-full max-w-md rounded-t-2xl">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Home className="mr-4 text-gray-500" />
                            <div>
                                <p className="text-gray-500">Lokasi saat ini:</p>
                                <p className="font-semibold">{locationName}</p>
                            </div>
                        </div>
                        {/* <hr className="my-4" /> */}
                        {/* <div className="flex items-center"> */}
                        {/*     <User className="mr-4 text-gray-500" /> */}
                        {/*     <div> */}
                        {/*         <p className="text-gray-500">Terkirim ke:</p> */}
                        {/*         <p className="font-semibold">Polisi, Keluarga, Driver Ojol</p> */}
                        {/*     </div> */}
                        {/* </div> */}
                        {/* <hr className="my-4" /> */}
                        {/* <div className="flex items-center justify-between"> */}
                        {/*     <p className="text-gray-500">Waktu Tanggap</p> */}
                        {/*     <p className="font-semibold">00.5 ses</p> */}
                        {/* </div> */}
                    </CardContent>
                </Card>
                <Button
                    className="w-full mt-4 bg-primary hover:bg-indigo-700"
                    onClick={handleCancel}
                >
                    Batalkan
                </Button>
            </div>
        </div>
    );
};

export default PanicModePage;
