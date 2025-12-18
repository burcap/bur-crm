"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ContactRecord = {
  id: string;
  businessName: string | null;
  contactName: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
};

type Props = {
  contact: ContactRecord;
  onUpdated: (contact: ContactRecord) => void;
};

export default function EditContactDialog({ contact, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ContactRecord>(contact);

  useEffect(() => {
    if (open) {
      setForm(contact);
      setError(null);
    }
  }, [contact, open]);

  const setField = (key: keyof ContactRecord) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/contacts/${contact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      onUpdated(updated);
      setOpen(false);
    } else {
      const payload = await res.json().catch(() => ({}));
      setError(payload.error || "Failed to update contact");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Business Name</Label>
            <Input value={form.businessName || ""} onChange={setField("businessName")} />
          </div>
          <div>
            <Label>Contact Name *</Label>
            <Input value={form.contactName} onChange={setField("contactName")} required />
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={setField("email")} required />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone || ""} onChange={setField("phone")} />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={form.address || ""} onChange={setField("address")} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>City</Label>
              <Input value={form.city || ""} onChange={setField("city")} />
            </div>
            <div>
              <Label>State</Label>
              <Input value={form.state || ""} onChange={setField("state")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Zip</Label>
              <Input value={form.zip || ""} onChange={setField("zip")} />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={form.country || ""} onChange={setField("country")} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={save} disabled={saving || !form.contactName || !form.email}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
