"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddToGroupDialog from "@/components/groups/AddToGroupDialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import AddContactDialog from "@/components/contacts/AddContactDialog";

type Contact = {
  id: string;
  businessName: string | null;
  contactName: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  groupList: { id: string; name: string }[];
};

type Group = { id: string; name: string };



export default function ContactsClient({ initialContacts, allGroups }: { initialContacts: Contact[]; allGroups: Group[] }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts); 
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

    const toggleAll = () =>
    setSelected(s => (s.length === contacts.length ? [] : contacts.map(c => c.id)));


  async function removeFromGroup(contactId: string, groupId: string) {
  // optimistic UI
  setContacts(cs =>
    cs.map(c =>
      c.id === contactId
        ? { ...c, groupList: c.groupList.filter(g => g.id !== groupId) }
        : c
    )
  );

  const res = await fetch(`/api/groups/${groupId}/contacts`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contactId }),
  });

  if (!res.ok) {
    // revert on failure
    setContacts(initialContacts);
    alert("Failed to remove from group");
  }
}

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
           <AddContactDialog
            onCreated={(c) =>
              setContacts((cs) => [
                { ...c, groupList: [] }, // ensure groupList exists
                ...cs,
              ])
            }
          />
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
            <TableHead>Groups</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((c) => (
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
              <TableCell>
                <div className="flex flex-wrap gap-1">
                    {c.groupList.map(g => (
                    <Badge
                        key={g.id}
                        variant="secondary"
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={e => {
                        e.stopPropagation();
                        removeFromGroup(c.id, g.id);
                        }}
                    >
                        {g.name}
                        <X className="h-3 w-3" />
                    </Badge>
                    ))}
                </div>
                </TableCell>
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
         onSuccess={(group, ids) => {
        setContacts((cs) =>
        cs.map((c) =>
            ids.includes(c.id)
            ? {
                ...c,
                // add if not already there
                groupList: c.groupList.some((g) => g.id === group.id)
                    ? c.groupList
                    : [...c.groupList, group],
                }
            : c
        )
        );
    }}
      />
    </div>
  );
}
