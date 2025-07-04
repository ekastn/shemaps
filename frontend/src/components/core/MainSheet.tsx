import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ContactList } from "./ContactList";
import { X, XIcon } from "lucide-react";

interface MainSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MainSheet({ open, onOpenChange }: MainSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-full sm:w-80 p-0 bg-primary">
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 text-white">
                        <SheetTitle className="flex items-center gap-2 text-3xl text-white">
                            Shemaps
                        </SheetTitle>
                        <SheetClose asChild>
                            <XIcon className="h-6 w-6" />
                        </SheetClose>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-white rounded-t-xl">
                        <ContactList />
                    </div>
                    <div className="text-center text-xs bg-white text-gray-500 py-4">
                        <p>Shemaps BETA</p>
                        <p>© 2025 Shemaps. All rights reserved.</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
