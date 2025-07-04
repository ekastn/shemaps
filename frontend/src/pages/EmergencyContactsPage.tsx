import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import type { EmergencyContact } from "@/lib/types";
import {
    createEmergencyContact,
    deleteEmergencyContact,
    getEmergencyContacts,
} from "@/services/emergencyContactService";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { useTutorial } from "@/components/core/Tutorial";

const EmergencyContactsPage = () => {
    const navigate = useNavigate();
    const { jwtToken, deviceId } = useAuth();
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newContactName, setNewContactName] = useState("");
    const [newContactPhone, setNewContactPhone] = useState("");
    const { advanceTutorial } = useTutorial();

    const handleClose = () => {
        navigate(-1);
    };

    const fetchContacts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getEmergencyContacts(jwtToken, deviceId);
            setContacts(data);
        } catch (err) {
            setError("Failed to fetch emergency contacts.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (deviceId) {
            // Only fetch if deviceId is available
            fetchContacts();
        }
    }, [jwtToken, deviceId]);

    const handleAddContact = async () => {
        if (!newContactName || !newContactPhone) {
            setError("Please fill in all fields.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await createEmergencyContact(jwtToken, deviceId, {
                contact_name: newContactName,
                phone_number: newContactPhone,
            });
            setNewContactName("");
            setNewContactPhone("");
            fetchContacts();
            advanceTutorial(17); // Advance tutorial after adding a contact
        } catch (err) {
            setError("Failed to add emergency contact.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteContact = async (contactId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteEmergencyContact(jwtToken, deviceId, contactId);
            fetchContacts(); // Re-fetch contacts after deleting
        } catch (err) {
            setError("Failed to delete emergency contact.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 bg-white">
            <div className="px-6 py-4 shadow-lg">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleClose}
                        variant="ghost"
                        size="icon"
                        className="hover:bg-purple-700"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-xl font-bold">Emergency Contacts</h1>
                </div>
            </div>

            {/* Contacts List */}
            <div className="p-6">
                <div className="space-y-6">
                    {isLoading && <p className="text-center text-blue-500">Loading contacts...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                </div>
                <Card>
                    <CardContent className="p-0 contact-list-tutorial-target">
                        {contacts.map((contact, index) => (
                            <div key={contact.id}>
                                <div className="flex items-center gap-4 p-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">
                                            {contact.contact_name}
                                        </h3>
                                        <p className="text-gray-500 text-xs">
                                            {contact.created_at}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="w-8 h-8">
                                            <Edit className="w-4 h-4 text-gray-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8"
                                            onClick={() => handleDeleteContact(contact.id)}
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>

                                {index < contacts.length - 1 && (
                                    <div className="border-b border-gray-100 mx-4" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <Dialog open={true} onOpenChange={handleClose}>
                <DialogTrigger asChild>
                    <div className="absolute bottom-8 right-6 add-contact-button-tutorial-target">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full shadow-lg">
                            <Plus className="w-8 h-8" />
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add new contact</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label>Contact name</Label>
                            <Input
                                value={newContactName}
                                onChange={(e) => setNewContactName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label>Phone number</Label>
                            <Input
                                value={newContactPhone}
                                onChange={(e) => setNewContactPhone(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleAddContact} disabled={isLoading}>
                            Add Contact
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmergencyContactsPage;
