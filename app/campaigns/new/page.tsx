"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/editor/RichTextEditor";
import GroupMultiSelect from "@/components/groups/GroupMultiSelect";
import { useGroups } from "@/components/groups/useGroups";

export default function NewCampaignPage() {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    fromEmail: "",
    htmlBody: "",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const groups = useGroups();
  const [groupIds, setGroupIds] = useState<string[]>([]);

  async function create() {
    setSaving(true);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const { id } = await res.json();
      if (groupIds.length) {
        await fetch(`/api/campaigns/${id}/groups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupIds }),
        });
      }
      router.push(`/campaigns/${id}`);
    } else {
      alert("Create failed");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold tracking-tight">New Campaign</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="fromEmail">From Email</Label>
          <Input
            id="fromEmail"
            type="email"
            value={form.fromEmail}
            onChange={(e) => setForm((f) => ({ ...f, fromEmail: e.target.value }))}
          />
        </div>

        <div>
          <Label>Email Body (HTML)</Label>
          <RichTextEditor
            value={form.htmlBody}
            onChange={(html) => setForm((f) => ({ ...f, htmlBody: html }))}
            className="bg-white"
          />
        </div>

        <Label>Target Groups</Label>
        <GroupMultiSelect groups={groups} value={groupIds} onChange={setGroupIds} />
      </div>

      <Button onClick={create} disabled={saving}>
        {saving ? "Creating…" : "Create Campaign"}
      </Button>
    </div>
  );
}
