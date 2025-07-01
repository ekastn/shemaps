import { useNavigate } from "react-router";
import { SMLocationButton } from "@/components/maps/SMLocationButton";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Users } from "lucide-react";

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
                        onClick={handlePinClick}
                        className="size-12 bg-white shadow-md rounded-full"
                    >
                        <MapPin className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleEmergencyContactsClick}
                        className="size-12 bg-white shadow-md rounded-full"
                    >
                        <Users className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSearchClick}
                        className="size-12 bg-white shadow-md rounded-full"
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                    <SMLocationButton />
                </div>
            </div>
        </>
    );
};

export default HomePage;
