import { useNavigate } from "react-router";
import { SMLocationButton } from "@/components/maps/SMLocationButton";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Search, Users } from "lucide-react";
import { SMSearchBar } from "@/components/SMSearch/SMSearchBar";

export const HomePage = () => {
    const navigate = useNavigate();

    const handleSearchClick = () => {
        navigate("/search");
    };

    const handlePinClick = () => {
        navigate("/pin");
    };

    const handleEmergencyContactsClick = () => {
        navigate("/contacts");
    };

    return (
        <>
            <div className="absolute bottom-6 right-4 z-10">
                <div className="flex flex-col items-end gap-y-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSearchClick}
                        className="size-12 rounded-full shadow-md bg-red-600  text-white hover:bg-red-700 focus-visible:ring-red-500"
                    >
                        <AlertTriangle className="w-6 h-6" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSearchClick}
                        className="size-12 rounded-full shadow-md bg-red-600  text-white hover:bg-red-700 focus-visible:ring-red-500"
                    >
                        <AlertTriangle className="w-6 h-6" />
                    </Button>
                </div>
            </div>
            <div className="absolute bottom-6 left-4 right-4 z-10">
                <div className="flex items-end gap-2">
                    <SMSearchBar
                        onFocus={() => navigate("/search")}
                        readOnly={true}
                        placeholder="Where do you want to go?"
                        value=""
                    />
                    <SMLocationButton />
                </div>
            </div>
        </>
    );
};

export default HomePage;
