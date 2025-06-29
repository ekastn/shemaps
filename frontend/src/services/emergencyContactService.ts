
import type { EmergencyContact } from "@/lib/types";

const API_URL = "http://localhost:3021/api/v1";

export const getEmergencyContacts = async (token: string): Promise<EmergencyContact[]> => {
    const response = await fetch(`${API_URL}/contacts`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch emergency contacts");
    }

    const result = await response.json();
    return result.data;
};

export const createEmergencyContact = async (token: string, contact: { contact_name: string; phone_number: string }): Promise<EmergencyContact> => {
    const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(contact),
    });

    if (!response.ok) {
        throw new Error("Failed to create emergency contact");
    }

    const result = await response.json();
    return result.data;
};

export const deleteEmergencyContact = async (token: string, contactId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/contacts/${contactId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete emergency contact");
    }
};
