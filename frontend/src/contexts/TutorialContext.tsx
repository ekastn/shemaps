import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import Joyride, { type CallBackProps, STATUS, type Step } from "react-joyride";
import type { TutorialProps } from "./TutorialProps";

interface TutorialContextType {
    advanceTutorial: (stepIndex: number) => void;
    currentStepIndex: number;
    setRun: (run: boolean) => void; // Added setRun to context
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<TutorialProps> = ({ run, setRun, children }) => {
    const joyrideRef = useRef<any>(null); // Keeping 'any' for now to avoid immediate type errors with 'go'

    const [steps, setSteps] = useState<Step[]>([
        {
            target: ".search-bar-tutorial-target",
            content:
                "Welcome to Shemaps! Start by searching for a place you want to go. Tap here to begin your search.",
            disableBeacon: true,
        },
        {
            target: ".location-button-tutorial-target",
            content: "Tap this button to quickly center the map on your current location.",
        },
        {
            target: ".panic-button-tutorial-target",
            content:
                "In an emergency, long-press this button to activate Panic Mode and alert your emergency contacts.",
        },
        {
            target: ".menu-button-tutorial-target",
            content: "Access your emergency contacts and other settings through this menu.",
        },
        {
            target: ".emergency-contacts-tutorial-target",
            content:
                "Manage your emergency contacts here. These contacts will be notified if you activate Panic Mode.",
        },
        {
            target: ".search-input-tutorial-target",
            content: "Type in your destination here. Suggestions will appear as you type.",
        },
        {
            target: ".choose-on-map-tutorial-target",
            content: "Prefer to pick a location directly from the map? Tap here to pin a location.",
        },
        {
            target: ".search-result-tutorial-target",
            content:
                "Select a search result or a recent location from this list to view its details.",
        },
        {
            target: ".confirm-pin-tutorial-target",
            content:
                "Move the map to center the pin on your desired location, then tap 'OK' to confirm.",
        },
        {
            target: ".directions-button-tutorial-target",
            content: "Get directions to this location. Shemaps will show you the safest route.",
        },
        {
            target: ".report-button-tutorial-target",
            content:
                "Report a safety issue or provide feedback about this location to help others.",
        },
        {
            target: ".route-info-tutorial-target",
            content:
                "View your route details here, including distance, estimated travel time, and safety level. If alternative routes are available, you can tap on them to explore different options.",
        },
        {
            target: ".safety-level-selection-tutorial-target",
            content: "Select the safety level of this location based on your experience.",
        },
        {
            target: ".description-tags-tutorial-target",
            content: "Provide a detailed description and add relevant tags to your report.",
        },
        {
            target: ".submit-report-tutorial-target",
            content:
                "Once you've filled out the details, submit your report to contribute to community safety.",
        },
        {
            target: ".add-contact-button-tutorial-target",
            content:
                "Add new emergency contacts here. They will be notified if you activate Panic Mode.",
        },
        {
            target: ".contact-list-tutorial-target",
            content: "View and manage your saved emergency contacts.",
        },
        {
            target: ".cancel-panic-button-tutorial-target",
            content: "If you activated Panic Mode by mistake, tap here to cancel the alert.",
        },
    ]);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetStepIndex, setTargetStepIndex] = useState<number | null>(null);

    useEffect(() => {
        if (run && joyrideRef.current && targetStepIndex !== null) {
            joyrideRef.current.go(targetStepIndex);
            setCurrentStepIndex(targetStepIndex);
            setTargetStepIndex(null); // Reset targetStepIndex after going to it
        }
    }, [run, targetStepIndex, joyrideRef.current]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, index } = data;
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            setRun(false);
            localStorage.setItem("shemaps_tutorial_completed", "true");
        } else {
            setCurrentStepIndex(index);
        }
    };

    const advanceTutorial = (stepIndex: number) => {
        setTargetStepIndex(stepIndex);
    };

    return (
        <TutorialContext.Provider value={{ advanceTutorial, currentStepIndex, setRun }}>
            {children}
            <Joyride
                ref={joyrideRef}
                run={run}
                steps={steps}
                continuous={false}
                showProgress
                showSkipButton
                callback={handleJoyrideCallback}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                }}
            />
        </TutorialContext.Provider>
    );
};

export function useTutorial() {
    const context = useContext(TutorialContext);
    if (context === undefined) {
        throw new Error("useTutorial must be used within a TutorialProvider");
    }
    return context;
}
