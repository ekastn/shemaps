import { useState } from "react";
import { useLongPress } from "@/hooks/useLongPress";
import { useRealtime } from "@/contexts/RealtimeContext";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

interface PanicButtonProps {
    variant?: "default" | "rounded";
    size?: number; // New: size in pixels for width and height
    className?: string;
    onClick?: () => void;
}

export function PanicButton({ variant = "default", size = 12, className, onClick }: PanicButtonProps) {
    const { triggerPanic, isPanicMode, resolvePanic } = useRealtime();
    const [isPressing, setIsPressing] = useState(false);
    const navigate = useNavigate();

    const longPressProps = useLongPress(() => {
        if (isPanicMode) {
            resolvePanic();
        } else {
            triggerPanic();
            navigate("/panic");
        }
        setIsPressing(false);
    }, 1000);

    const handlePressStart = () => {
        setIsPressing(true);
    };

    const handlePressEnd = () => {
        setIsPressing(false);
    };

    return (
        <Button
            {...longPressProps}
            onMouseDownCapture={handlePressStart}
            onMouseUpCapture={handlePressEnd}
            onTouchStartCapture={handlePressStart}
            onTouchEndCapture={handlePressEnd}
            onClick={onClick}
            className={`shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${variant === "rounded" ? `rounded-full w-${size} h-${size}` : ""} ${className} ${
                isPressing ? "bg-primary" : isPanicMode ? "bg-green-500" : "bg-red-600"
            }`}
        >
            {isPanicMode ? (
                <ShieldCheck className="size-6 text-white" />
            ) : (
                <div className="flex items-center justify-center">
                    <ShieldAlert className="size-6 text-white" />
                    {variant !== "rounded" && <h3 className="text-lg">Panic</h3>}
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
