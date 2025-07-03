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

export function AddContactDialog({
    open,
    handleClose,
    handleAddContact,
    isLoading,
    newContactName,
    setNewContactName,
    newContactPhone,
    setNewContactPhone,
}) {
    return (
        <Dialog open={open} onOpenChange={handleClose}>
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
    );
}
