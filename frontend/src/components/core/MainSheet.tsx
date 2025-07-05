import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ContactList } from "./ContactList";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTutorial } from "@/contexts/TutorialContext";

interface MainSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MainSheet({ open, onOpenChange }: MainSheetProps) {
    const { advanceTutorial, setRun } = useTutorial();

    const handleStartTutorial = () => {
        setRun(true);
        onOpenChange(false); // Close the sheet after starting tutorial
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-full sm:w-80 p-0 bg-shemaps-main">
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 text-white">
                        <SheetTitle className="flex items-center gap-2 text-3xl text-white">
                            Settings
                        </SheetTitle>
                        <SheetClose asChild>
                            <XIcon className="h-6 w-6" />
                        </SheetClose>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-shemaps-light-shades rounded-t-xl">
                        <div className="emergency-contacts-tutorial-target">
                            <ContactList />
                        </div>
                        <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={handleStartTutorial}
                        >
                            Start Tutorial
                        </Button>
                    </div>
                    <div className="text-center text-xs bg-shemaps-light-shades text-gray-500 py-4">
                        <p>Shemaps BETA</p>
                        <p>© 2025 Shemaps. All rights reserved.</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
