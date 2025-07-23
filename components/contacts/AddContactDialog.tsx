"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ContactInput = {
  businessName?: string;
  contactName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export default function AddContactDialog({
  onCreated,
}: {
  onCreated: (c: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ContactInput>({
    contactName: "",
    email: "",
  });

  async function save() {
    setSaving(true);
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const c = await res.json();
      onCreated(c);
      setOpen(false);
      setForm({ contactName: "", email: "" });
    } else {
      alert("Failed");
    }
  }

  const set = (k: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Contact</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Contact</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Business Name</Label>
            <Input value={form.businessName || ""} onChange={set("businessName")} />
          </div>
          <div>
            <Label>Contact Name *</Label>
            <Input value={form.contactName} onChange={set("contactName")} required />
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={set("email")} required />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone || ""} onChange={set("phone")} />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={form.address || ""} onChange={set("address")} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>City</Label>
              <Input value={form.city || ""} onChange={set("city")} />
            </div>
            <div>
              <Label>State</Label>
              <Input value={form.state || ""} onChange={set("state")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Zip</Label>
              <Input value={form.zip || ""} onChange={set("zip")} />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={form.country || ""} onChange={set("country")} />
            </div>
          </div>

          <Button onClick={save} disabled={saving || !form.contactName || !form.email}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
