import { useState } from "react";
import { useLongPress } from "@/hooks/useLongPress";
import { useRealtime } from "@/contexts/RealtimeContext";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export function PanicButton() {
    const { triggerPanic, isPanicMode, resolvePanic } = useRealtime();
    const [isPressing, setIsPressing] = useState(false);

    const longPressProps = useLongPress(() => {
        if (isPanicMode) {
            resolvePanic();
        } else {
            triggerPanic();
        }
        setIsPressing(false);
    }, 1000);

    const handlePressStart = () => {
        setIsPressing(true);
    };

    const handlePressEnd = () => {
        setIsPressing(false);
    };

    const positionAndSize = "absolute bottom-24 left-10 w-20 h-20";

    return (
        <Button
            {...longPressProps}
            onMouseDownCapture={handlePressStart}
            onMouseUpCapture={handlePressEnd}
            onTouchStartCapture={handlePressStart}
            onTouchEndCapture={handlePressEnd}
            className={`shadow-lg flex items-center justify-center transition-all duration-300 ${
                isPressing ? "bg-yellow-400" : isPanicMode ? "bg-green-500" : "bg-red-600"
            }`}
        >
            {isPanicMode ? (
                <ShieldCheck className="size-6 text-white" />
            ) : (
                <div className="flex items-center justify-center">
                    <ShieldAlert className="size-6 text-white" />
                    <h3 className="text-lg">Panic</h3>
                </div>
            )}

            {isPressing && (
                <div
                    className="absolute inset-0 rounded-full bg-white opacity-50 animate-ping"
                    style={{ animationDuration: "3s" }}
                ></div>
            )}
        </Button>
    );
}
