import type { EmergencyContact } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";

const API_URL = "http://localhost:3021/api/v1";

export const getEmergencyContacts = async (token: string | null, deviceId: string | null): Promise<EmergencyContact[]> => {
    const result = await authenticatedFetch(`${API_URL}/contacts`, {
        token,
        deviceId,
    });
    return result.data;
};

export const createEmergencyContact = async (token: string | null, deviceId: string | null, contact: { contact_name: string; phone_number: string }): Promise<EmergencyContact> => {
    const result = await authenticatedFetch(`${API_URL}/contacts`, {
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
    await authenticatedFetch(`${API_URL}/contacts/${contactId}`, {
        method: "DELETE",
        token,
        deviceId,
    });
};