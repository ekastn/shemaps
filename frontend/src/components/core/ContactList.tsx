import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import type { EmergencyContact } from "@/lib/types";
import {
    createEmergencyContact,
    deleteEmergencyContact,
    getEmergencyContacts,
    updateEmergencyContact,
} from "@/services/emergencyContactService";
import { Edit, Phone, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ContactFormDialog } from "./ContactFormDialog";

export function ContactList() {
    const { jwtToken, deviceId } = useAuth();
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddContactDialog, setShowAddContactDialog] = useState(false);
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

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

    const handleSaveContact = async (contactData: { contact_name: string; phone_number: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            if (editingContact) {
                await updateEmergencyContact(jwtToken, deviceId, editingContact.id, contactData);
            } else {
                await createEmergencyContact(jwtToken, deviceId, contactData);
            }
            setShowAddContactDialog(false);
            setEditingContact(null);
            fetchContacts();
        } catch (err) {
            setError(`Failed to ${editingContact ? "update" : "add"} emergency contact.`);
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
        <div className="h-full">
            <div className="flex justify-between">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-red-600" />
                    <p>Emergency Contacts</p>
                </h3>
                <Button
                    onClick={() => setShowAddContactDialog(true)}
                    variant="ghost"
                    size="sm"
                    className="rounded-md"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-2">
                {contacts.map((contact, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback className="text-sm">
                                {contact.contact_name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-medium text-sm">{contact.contact_name}</p>
                            <p className="text-xs text-gray-600">{contact.phone_number}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => {
                                setEditingContact(contact);
                                setShowAddContactDialog(true);
                            }}>
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
                ))}
            </div>

            <ContactFormDialog
                open={showAddContactDialog}
                handleClose={() => {
                    setShowAddContactDialog(false);
                    setEditingContact(null);
                }}
                onSave={handleSaveContact}
                isLoading={isLoading}
                initialContact={editingContact}
            />

            {isLoading && <p className="text-center text-blue-500">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!isLoading && !error && contacts.length === 0 && (
                <p className="text-center text-gray-500">No contacts found.</p>
            )}
        </div>
    );
}
