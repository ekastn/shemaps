import { useNavigate } from "react-router";
import { SMLocationButton } from "@/components/maps/SMLocationButton";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Search, Users } from "lucide-react";
import { SMSearchBar } from "@/components/SMSearch/SMSearchBar";
import { PanicButton } from "@/components/core/PanicButton";

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
        <div className="absolute bottom-0 left-0 right-0 ">
            <div className="flex items-center justify-between p-4 gap-y-2 pointer-events-auto">
                <SMLocationButton />
                <PanicButton />
            </div>
            <div className="p-6 max-h-[60vh] bg-white overflow-y-auto  rounded-t-2xl shadow-lg pointer-events-auto">
                <SMSearchBar
                    onFocus={() => navigate("/search")}
                    readOnly={true}
                    placeholder="Where do you want to go?"
                    value=""
                />
            </div>
        </div>
    );
};

export default HomePage;
