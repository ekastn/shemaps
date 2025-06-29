import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
    getEmergencyContacts,
    createEmergencyContact,
    deleteEmergencyContact,
} from "@/services/emergencyContactService";
import { useAuth } from "@/contexts/AuthContext";
import type { EmergencyContact } from "@/lib/types";

const EmergencyContactsPage = () => {
    const navigate = useNavigate();
    const { jwtToken, deviceId } = useAuth();
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newContactName, setNewContactName] = useState("");
    const [newContactPhone, setNewContactPhone] = useState("");

    const handleClose = () => {
        navigate(-1);
    };

    const fetchContacts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getEmergencyContacts(jwtToken, deviceId);
            console.log(data);
            setContacts(data);
        } catch (err) {
            setError("Failed to fetch emergency contacts.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (deviceId) { // Only fetch if deviceId is available
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
        <div className="fixed inset-0 z-20 bg-white flex items-center justify-center p-4">
            <Card className="max-w-2xl mx-auto shadow-lg rounded-lg relative bg-white/90 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        Emergency Contacts
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {isLoading && <p className="text-center text-blue-500">Loading contacts...</p>}
                        {error && <p className="text-center text-red-500">{error}</p>}

                        {/* Contact List */}
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {contacts.length === 0 && !isLoading && !error && (
                                <p className="text-center text-gray-500">No emergency contacts found.</p>
                            )}
                            {contacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 bg-white shadow-sm transition-all hover:shadow-md"
                                >
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">{contact.contact_name}</p>
                                        <p className="text-md text-gray-600">{contact.phone_number}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteContact(contact.id)}
                                        disabled={isLoading}
                                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-6 w-6" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Add Contact Form */}
                        <div className="space-y-4 pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-center text-gray-800">
                                Add New Contact
                            </h3>
                            <Input
                                placeholder="Contact Name"
                                className="text-md p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={newContactName}
                                onChange={(e) => setNewContactName(e.target.value)}
                                disabled={isLoading}
                            />
                            <Input
                                placeholder="Phone Number"
                                className="text-md p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={newContactPhone}
                                onChange={(e) => setNewContactPhone(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button
                                className="w-full text-md py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition-colors"
                                onClick={handleAddContact}
                                disabled={isLoading}
                            >
                                Add Contact
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmergencyContactsPage;
