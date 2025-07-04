import { SMSearchBar } from "@/components/SMSearch/SMSearchBar";
import { MainSheet } from "@/components/core/MainSheet";
import { PanicButton } from "@/components/core/PanicButton";
import { SMLocationButton } from "@/components/maps/SMLocationButton";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useTutorial } from "@/components/core/Tutorial";

interface OutletContext {
    setRunTutorial: (run: boolean) => void;
}

export const HomePage = () => {
    const navigate = useNavigate();
    const [openMainSheet, setOpenMainSheet] = useState(false);
    const { setRunTutorial } = useOutletContext<OutletContext>();
    const { advanceTutorial, currentStepIndex } = useTutorial();

    return (
        <>
            <div className="absolute top-0 left-0 right-0">
                <div className="flex items-center p-4 justify-between pointer-events-auto">
                    <Button
                        variant="outline"
                        size="icon"
                        className="bg-white shadow-md size-12 rounded-md cursor-pointer menu-button-tutorial-target"
                        onClick={() => { setOpenMainSheet(true); if (currentStepIndex === 3) advanceTutorial(4); }}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            <MainSheet open={openMainSheet} onOpenChange={setOpenMainSheet} />

            <div className="absolute bottom-0 left-0 right-0 ">
                <div className="flex items-center justify-between p-4 gap-y-2 pointer-events-auto">
                    <SMLocationButton className="location-button-tutorial-target" onClick={() => { if (currentStepIndex === 1) advanceTutorial(2); }} />
                    <PanicButton className="panic-button-tutorial-target" onClick={() => { if (currentStepIndex === 2) advanceTutorial(3); }} />
                </div>
                <div className="p-6 max-h-[60vh] bg-white overflow-y-auto  rounded-t-2xl shadow-lg pointer-events-auto">
                    <SMSearchBar
                        onFocus={() => { if (currentStepIndex === 0) { navigate("/search"); advanceTutorial(1); } }}
                        readOnly={true}
                        placeholder="Where do you want to go?"
                        value=""
                        className="search-bar-tutorial-target"
                    />
                </div>
            </div>
        </>
    );
};

export default HomePage;
