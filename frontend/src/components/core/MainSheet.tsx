import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ContactList } from "./ContactList";

interface MainSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MainSheet({ open, onOpenChange }: MainSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-full sm:w-80 p-0">
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-white">
                        <SheetTitle className="flex items-center gap-2">
                            Shemaps
                        </SheetTitle>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <ContactList />
                    </div>
                    <div className="text-center text-xs text-gray-500 py-4">
                        <p>Shemaps BETA</p>
                        <p>© 2025 Shemaps. All rights reserved.</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
