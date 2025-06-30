import type { EmergencyContact } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";

export const getEmergencyContacts = async (token: string | null, deviceId: string | null): Promise<EmergencyContact[]> => {
    const result = await authenticatedFetch(`/contacts`, {
        token,
        deviceId,
    });
    return result.data;
};

export const createEmergencyContact = async (token: string | null, deviceId: string | null, contact: { contact_name: string; phone_number: string }): Promise<EmergencyContact> => {
    const result = await authenticatedFetch(`/contacts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
        token,
        deviceId,
    });
    return result.data;
};

export const deleteEmergencyContact = async (token: string | null, deviceId: string | null, contactId: string): Promise<void> => {
    await authenticatedFetch(`/contacts/${contactId}`, {
        method: "DELETE",
        token,
        deviceId,
    });
};
