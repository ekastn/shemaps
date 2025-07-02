import { useState } from 'react';
import { useLongPress } from '@/hooks/useLongPress';
import { useRealtime } from '@/contexts/RealtimeContext';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export function PanicButton() {
    const { triggerPanic } = useRealtime();
    const [isPressing, setIsPressing] = useState(false);

    const longPressProps = useLongPress(() => {
        console.log('triggerPanic');
        triggerPanic();
        setIsPressing(false);
    }, 2000);

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
            className={`absolute bottom-24 left-10 w-20 h-20 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                isPressing ? 'bg-yellow-400' : 'bg-red-600'
            }`}>
            <ShieldAlert className="w-10 h-10 text-white" />
            {isPressing && (
                <div
                    className="absolute inset-0 rounded-full bg-white opacity-50 animate-ping"
                    style={{ animationDuration: '3s' }}
                ></div>
            )}
        </Button>
    );
}
