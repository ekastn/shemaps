export function BottomPanel({ children }: { children: React.ReactNode }) {
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg pointer-events-auto overflow-hidden">
            <div className="p-6 max-h-[60vh] overflow-y-auto">{children}</div>
        </div>
    );
}
