"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type Group = { id: string; name: string };

export default function GroupsClient({ initialGroups }: { initialGroups: Group[] }) {
  const [groups, setGroups] = useState(initialGroups);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  async function createGroup() {
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const g: Group = await res.json();
      setGroups((gs) => [...gs, g].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setOpen(false);
    } else {
      alert("Failed to create group");
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>Create Group</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Group</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
              <Button onClick={createGroup} disabled={!name.trim()}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />
      <ul className="list-disc ml-6 space-y-1">
        {groups.map(g => (
            <li key={g.id}>
            <a className="underline" href={`/groups/${g.id}`}>{g.name}</a>
            </li>
        ))}
      </ul>
    </div>
  );
}
