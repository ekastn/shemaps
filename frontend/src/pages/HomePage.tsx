import { SMSearchBar } from "@/components/SMSearch/SMSearchBar";
import { MainSheet } from "@/components/core/MainSheet";
import { PanicButton } from "@/components/core/PanicButton";
import { SMLocationButton } from "@/components/maps/SMLocationButton";
import { Button } from "@/components/ui/button";
import { useTutorial } from "@/contexts/TutorialContext";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";

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
            <div className="absolute top-0 inset-x-0 bg-shemaps-main rounded-b-2xl shadow-lg z-10 pointer-events-auto">
                <div className="flex items-center w-full px-4 py-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute text-shemaps-light-shades shadow-md size-12 rounded-md cursor-pointer menu-button-tutorial-target"
                        onClick={() => {
                            setOpenMainSheet(true);
                            if (currentStepIndex === 3) advanceTutorial(4);
                        }}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                    <h1 className="text-2xl font-bold mx-auto text-shemaps-light-shades">
                        Shemaps
                    </h1>
                </div>
            </div>

            <MainSheet open={openMainSheet} onOpenChange={setOpenMainSheet} />

            <div className="absolute bottom-0 left-0 right-0 ">
                <div className="flex items-center justify-between p-4 gap-y-2 pointer-events-auto">
                    <SMLocationButton
                        className="location-button-tutorial-target"
                        onClick={() => {
                            if (currentStepIndex === 1) advanceTutorial(2);
                        }}
                    />
                    <PanicButton
                        variant="rounded"
                        className="panic-button-tutorial-target"
                        onClick={() => {
                            if (currentStepIndex === 2) advanceTutorial(3);
                        }}
                    />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 ">
                <div className="flex items-center justify-between p-4 gap-y-2 pointer-events-auto">
                    <SMLocationButton
                        className="location-button-tutorial-target"
                        onClick={() => {
                            if (currentStepIndex === 1) advanceTutorial(2);
                        }}
                    />
                    <PanicButton
                        className="panic-button-tutorial-target"
                        onClick={() => {
                            if (currentStepIndex === 2) advanceTutorial(3);
                        }}
                    />
                </div>
                <div className="p-6 max-h-[60vh] bg-shemaps-main overflow-y-auto  rounded-t-2xl shadow-lg pointer-events-auto">
                    <SMSearchBar
                        onFocus={() => {
                            if (currentStepIndex === 0) {
                                navigate("/search");
                                advanceTutorial(1);
                            }
                        }}
                        readOnly={true}
                        className="search-bar-tutorial-target"
                    />
                </div>
            </div>
        </>
    );
};

export default HomePage;
