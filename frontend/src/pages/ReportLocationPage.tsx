import { useTutorial } from "@/contexts/TutorialContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "@/contexts/LocationContext";
import { useSafetyReports } from "@/contexts/SafetyReportContext";
import { submitSafetyReport } from "@/services/reportService";
import { useMap } from "@vis.gl/react-google-maps";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export const ReportLocationPage = () => {
    const navigate = useNavigate();
    const { fetchReportsInBounds } = useSafetyReports();
    const { selectedLocation, setSelectedLocation } = useLocation();
    const { jwtToken, deviceId } = useAuth();
    const map = useMap();
    const { advanceTutorial } = useTutorial();

    const [safetyLevel, setSafetyLevel] = useState<"DANGEROUS" | "CAUTIOUS" | "SAFE">("DANGEROUS");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!selectedLocation?.coordinate) {
        navigate("/");
        return null;
    }

    const handleTagAdd = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
            advanceTutorial(15); // Advance tutorial after adding a tag
        }
    };

    const handleTagRemove = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleTagAdd();
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            const coordinate = selectedLocation.coordinate!;

            // Create a new report
            await submitSafetyReport(jwtToken, deviceId, {
                latitude: coordinate.lat,
                longitude: coordinate.lng,
                safety_level: safetyLevel,
                description: description,
                tags: tags,
            });

            // Trigger fetching reports in the current map bounds
            if (map && map.getBounds) {
                await fetchReportsInBounds(map.getBounds()!);
            }

            advanceTutorial(16); // Advance tutorial after submitting report
            navigate("/");
        } catch (err) {
            console.error("Error submitting report:", err);
            setError("Failed to submit safety report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-shemaps-main rounded-t-3xl shadow-lg pointer-events-auto overflow-hidden">
            <div className="p-6 max-h-[60vh] overflow-y-auto text-shemaps-primary">
                <div className="mb-4">
                    <div className="flex items-start justify-between">
                        <h1 className="text-2xl font-bold mb-1">Report Place</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            aria-label="Close"
                            className="pointer-events-auto hover:bg-white"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="text-shemaps-primary">
                        Share your experience to help keep others safe
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-medium mb-2">Location</h3>
                        <p className="text-sm bg-shemaps-light-shades/10 p-2 rounded">
                            {selectedLocation.name || "Custom location"}
                            {selectedLocation.address ? ` • ${selectedLocation.address}` : ""}
                        </p>
                    </div>

                    <div className="safety-level-selection-tutorial-target">
                        <h3 className="text-sm font-medium mb-2">Safety Level</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {/* <Button */}
                            {/*     variant="ghost" */}
                            {/*     size="sm" */}
                            {/*     className="flex-1 gap-2 bg-shemaps-light-shades rounded-xl text-red-600 hover:text-red-700 cursor-pointer report-button-tutorial-target" */}
                            {/*     onClick={() => { */}
                            {/*         navigate("/report"); */}
                            {/*         advanceTutorial(11); */}
                            {/*     }} */}
                            {/* > */}
                            {/*     <Shield className="h-4 w-4" /> */}
                            {/*     <span className="text-current">Report</span> */}
                            {/* </Button> */}

                            <Button
                                type="button"
                                variant={safetyLevel === "DANGEROUS" ? "destructive" : "ghost"}
                                onClick={() => {
                                    setSafetyLevel("DANGEROUS");
                                    advanceTutorial(14);
                                }}
                                className="w-full"
                            >
                                Dangerous
                            </Button>
                            <Button
                                type="button"
                                variant={safetyLevel === "CAUTIOUS" ? "secondary" : "ghost"}
                                onClick={() => {
                                    setSafetyLevel("CAUTIOUS");
                                    advanceTutorial(14);
                                }}
                                className="w-full"
                            >
                                Caution
                            </Button>
                            <Button
                                type="button"
                                variant={safetyLevel === "SAFE" ? "default" : "ghost"}
                                onClick={() => {
                                    setSafetyLevel("SAFE");
                                    advanceTutorial(14);
                                }}
                                className="w-full"
                            >
                                Safe
                            </Button>
                        </div>
                    </div>

                    <div className="description-tags-tutorial-target">
                        <h3 className="text-sm font-medium mb-2">Description</h3>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's happening at this location?"
                            className="w-full min-h-[100px] p-2 border rounded-md resize-none focus:outline-none"
                        />
                    </div>

                    <div className="description-tags-tutorial-target">
                        <h3 className="text-sm font-medium mb-2">Tags</h3>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add a tag (e.g., night, theft)"
                                className=" border rounded-md ring-0 outline-none placeholder:text-shemaps-primary/50 focus:outline-none"
                            />
                            <Button type="button" variant="ghost" onClick={handleTagAdd}>
                                Add
                            </Button>
                        </div>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-shemaps-primary text-xs px-2 py-1 rounded-full flex items-center"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleTagRemove(tag)}
                                            className="ml-1 text-muted-foreground hover:text-foreground"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="flex-1 text-black"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 submit-report-tutorial-target"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
