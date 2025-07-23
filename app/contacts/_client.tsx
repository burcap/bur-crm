"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddToGroupDialog from "@/components/groups/AddToGroupDialog";

type Contact = {
  id: string;
  businessName: string | null;
  contactName: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
};
type Group = { id: string; name: string };

export default function ContactsClient({ initialContacts, allGroups }: { initialContacts: Contact[]; allGroups: Group[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleAll = () =>
    setSelected((s) => (s.length === initialContacts.length ? [] : initialContacts.map((c) => c.id)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleAll}>
            {selected.length === initialContacts.length ? "Unselect all" : "Select all"}
          </Button>
          <Button disabled={!selected.length} onClick={() => setDialogOpen(true)}>
            Add to Group
          </Button>
          <Button><a href="/contacts/import">Import CSV</a></Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selected.length === initialContacts.length && selected.length > 0}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialContacts.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Checkbox
                  checked={selected.includes(c.id)}
                  onCheckedChange={() => toggle(c.id)}
                />
              </TableCell>
              <TableCell>{c.businessName}</TableCell>
              <TableCell>{c.contactName}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>{c.city}</TableCell>
              <TableCell>{c.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddToGroupDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        contactIds={selected}
        groups={allGroups}
        onDone={() => setSelected([])}
      />
    </div>
  );
}
