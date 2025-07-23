"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Contact = {
  id: string;
  businessName: string | null;
  contactName: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
};

export default function GroupDetailClient({
  groupId,
  groupName,
  contacts: initialContacts,
}: {
  groupId: string;
  groupName: string;
  contacts: Contact[];
}) {
  const [contacts, setContacts] = useState(initialContacts);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function removeContact(id: string) {
    setRemovingId(id);
    const res = await fetch(`/api/groups/${groupId}/contacts`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId: id }),
    });
    setRemovingId(null);
    if (res.ok) {
      setContacts((cs) => cs.filter((c) => c.id !== id));
    } else {
      alert("Failed");
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">{groupName}</h1>
      <div className="text-sm text-muted-foreground">{contacts.length} contact(s)</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.businessName}</TableCell>
              <TableCell>{c.contactName}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>{c.city}</TableCell>
              <TableCell>{c.state}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={removingId === c.id}
                  onClick={() => removeContact(c.id)}
                >
                  {removingId === c.id ? "Removing…" : "Remove"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
