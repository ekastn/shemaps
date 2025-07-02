import { useCallback, useRef, useEffect } from 'react';

export const useLongPress = (callback: () => void, ms = 3000) => {
    const timeout = useRef<number | undefined>(undefined);
    const cbRef = useRef(callback);

    useEffect(() => {
        cbRef.current = callback;
    }, [callback]);

    const start = useCallback(() => {
        // Use explicit type assertion for setTimeout to ensure number return type
        timeout.current = (setTimeout as (handler: TimerHandler, timeout?: number, ...args: any[]) => number)(() => cbRef.current(), ms);
    }, [ms]);

    const stop = useCallback(() => {
        if (timeout.current) {
            // Use explicit type assertion for clearTimeout to accept number
            (clearTimeout as (handle?: number) => void)(timeout.current);
            timeout.current = undefined;
        }
    }, []);

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onTouchStart: start,
        onTouchEnd: stop,
    };
};