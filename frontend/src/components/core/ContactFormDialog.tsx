import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmergencyContact } from "@/lib/types";
import { useEffect, useState } from "react";

interface ContactFormDialogProps {
    open: boolean;
    handleClose: () => void;
    onSave: (contact: { contact_name: string; phone_number: string }) => void;
    isLoading: boolean;
    initialContact?: EmergencyContact | null; // Optional: for editing existing contacts
}

export function ContactFormDialog({
    open,
    handleClose,
    onSave,
    isLoading,
    initialContact,
}: ContactFormDialogProps) {
    const [contactName, setContactName] = useState(initialContact?.contact_name || "");
    const [contactPhone, setContactPhone] = useState(initialContact?.phone_number || "");

    useEffect(() => {
        if (open) {
            setContactName(initialContact?.contact_name || "");
            setContactPhone(initialContact?.phone_number || "");
        }
    }, [open, initialContact]);

    const handleSubmit = () => {
        onSave({ contact_name: contactName, phone_number: contactPhone });
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="contactName">Contact name</Label>
                        <Input
                            id="contactName"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="phoneNumber">Phone number</Label>
                        <Input
                            id="phoneNumber"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {initialContact ? "Save Changes" : "Add Contact"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}