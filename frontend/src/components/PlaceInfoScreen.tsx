import { X, Navigation, Play, Bookmark, MoreHorizontal, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import type { Location } from "@/lib/types";

interface PlaceInfoScreenProps {
    location: Location | null;
    onClose: () => void;
}

export function PlaceInfoScreen({ location, onClose }: PlaceInfoScreenProps) {
    if (!location) return null;
    
    return (
        <div className="fixed inset-0 z-20 pointer-events-none">
            {/* Backdrop with close button at top */}
            <div className="absolute inset-0">
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-10 pointer-events-auto bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Content as bottom sheet */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg pointer-events-auto overflow-hidden">
                {/* Drag handle */}
                <div className="flex justify-center py-2">
                    <div className="w-12 h-1 bg-gray-200 rounded-full" />
                </div>
                
                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-1">{location.name}</h1>
                        <p className="text-gray-600">{location.address}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-gray-100">
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={() => console.log('Directions to', location.name)}
                        >
                            <Navigation className="h-4 w-4" />
                            <span>Directions</span>
                        </Button>
                        
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={() => console.log('Start navigation to', location.name)}
                        >
                            <Play className="h-4 w-4" />
                            <span>Start</span>
                        </Button>
                        
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 gap-2 text-blue-600 hover:text-blue-700"
                            onClick={() => console.log('Save', location.name)}
                        >
                            <Bookmark className="h-4 w-4 fill-current" />
                            <span className="text-current">Save</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
