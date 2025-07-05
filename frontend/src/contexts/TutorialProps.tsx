import type React from "react";

export interface TutorialProps {
    run: boolean;
    setRun: (run: boolean) => void;
    children: React.ReactNode;
}

