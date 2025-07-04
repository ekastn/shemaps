import { SMSearchBar } from "@/components/SMSearch/SMSearchBar";
import { MainSheet } from "@/components/core/MainSheet";
import { PanicButton } from "@/components/core/PanicButton";
import { SMLocationButton } from "@/components/maps/SMLocationButton";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export const HomePage = () => {
    const [opehSheen, setOpenSheen] = useState(false);

    const navigate = useNavigate();

    return (
        <>
            <div className="absolute top-0 left-0 right-0">
                <div className="flex items-center p-4 justify-between pointer-events-auto">
                    <Button
                        variant="outline"
                        size="icon"
                        className="bg-white shadow-md size-12 rounded-md cursor-pointer"
                        onClick={() => setOpenSheen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            <MainSheet open={opehSheen} onOpenChange={setOpenSheen} />

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
        </>
    );
};

export default HomePage;
