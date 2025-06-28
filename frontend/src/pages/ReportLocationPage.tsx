import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { submitSafetyReport } from '@/services/reportService';
import { useSafetyReports } from "@/contexts/SafetyReportContext";
import { useLocation } from "@/contexts/LocationContext";
import { useMap } from "@vis.gl/react-google-maps";

export const ReportLocationPage = () => {
    const navigate = useNavigate();
    const { fetchReportsInBounds } = useSafetyReports();
    const { selectedLocation } = useLocation();
    const map = useMap();
    
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
        }
    };

    const handleTagRemove = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
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
            await submitSafetyReport({
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
            
            navigate("/");
        } catch (err) {
            console.error("Error submitting report:", err);
            setError("Failed to submit safety report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="absolute inset-0 mx-auto max-w-md p-4">
            <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-bold">Report Safety Issue</CardTitle>
                    <CardDescription>
                        Share your experience to help keep others safe
                    </CardDescription>
                </CardHeader>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-medium mb-2">Location</h3>
                        <p className="text-sm bg-muted/50 p-2 rounded">
                            {selectedLocation.name || 'Custom location'} 
                            {selectedLocation.address ? ` • ${selectedLocation.address}` : ''}
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-medium mb-2">Safety Level</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <Button 
                                type="button" 
                                variant={safetyLevel === "DANGEROUS" ? "destructive" : "outline"}
                                onClick={() => setSafetyLevel("DANGEROUS")}
                                className="w-full"
                            >
                                Dangerous
                            </Button>
                            <Button 
                                type="button" 
                                variant={safetyLevel === "CAUTIOUS" ? "secondary" : "outline"}
                                onClick={() => setSafetyLevel("CAUTIOUS")}
                                className="w-full"
                            >
                                Caution
                            </Button>
                            <Button 
                                type="button" 
                                variant={safetyLevel === "SAFE" ? "default" : "outline"}
                                onClick={() => setSafetyLevel("SAFE")}
                                className="w-full"
                            >
                                Safe
                            </Button>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-medium mb-2">Description</h3>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's happening at this location?"
                            className="w-full min-h-[100px] p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-medium mb-2">Tags</h3>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add a tag (e.g., night, theft)"
                            />
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleTagAdd}
                            >
                                Add
                            </Button>
                        </div>
                        
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map(tag => (
                                    <span 
                                        key={tag} 
                                        className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full flex items-center"
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
                            onClick={() => navigate("/")}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
