"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import GroupSelect from "./GroupSelect";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contactIds: string[];
  groups: { id: string; name: string }[];
  onDone?: () => void;
  onSuccess?: (group: { id: string; name: string }, contactIds: string[]) => void; 
};

export default function AddToGroupDialog({ open, onOpenChange, contactIds, groups, onDone }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!selectedGroup) return;
    setSaving(true);
    const res = await fetch(`/api/groups/${selectedGroup}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactIds }),
    });
    setSaving(false);
    if (res.ok) {
      const g = groups.find((x) => x.id === selectedGroup)!;
      onSuccess?.(g, contactIds);  
      onOpenChange(false);
      onDone?.();
    } else alert("Failed");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {contactIds.length} contact(s) to a group</DialogTitle>
        </DialogHeader>
        <GroupSelect
          groups={groups}
          value={selectedGroup}
          onChange={setSelectedGroup}
        />
        <Button className="mt-4" disabled={!selectedGroup || saving} onClick={save}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
