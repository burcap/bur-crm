"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/editor/RichTextEditor";
import GroupMultiSelect from "@/components/groups/GroupMultiSelect";
import { useGroups } from "@/components/groups/useGroups";

export default function EditCampaign() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", fromEmail: "", htmlBody: "" });
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const groups = useGroups();

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/campaigns/${id}`);
      const data = await res.json();
      setForm({
        name: data.name || "",
        subject: data.subject || "",
        fromEmail: data.fromEmail || "",
        htmlBody: data.htmlBody || "",
      });
      setGroupIds(data.groups?.map((g: any) => g.groupId) ?? []);
      setLoading(false);
    })();
  }, [id]);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await fetch(`/api/campaigns/${id}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupIds }),
      });
      router.push(`/campaigns/${id}`);
    } else {
      alert("Save failed");
    }
    setSaving(false);
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-4 p-6">
      <h1 className="text-2xl font-bold">Edit Campaign</h1>
      <div>
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      </div>
      <div>
        <Label>Subject</Label>
        <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
      </div>
      <div>
        <Label>From Email</Label>
        <Input type="email" value={form.fromEmail} onChange={(e) => setForm((f) => ({ ...f, fromEmail: e.target.value }))} />
      </div>
      <div>
        <Label>Target Groups</Label>
        <GroupMultiSelect groups={groups} value={groupIds} onChange={setGroupIds} />
      </div>
      <div>
        <Label>HTML Body</Label>
        <RichTextEditor value={form.htmlBody} onChange={(html) => setForm((f) => ({ ...f, htmlBody: html }))} />
      </div>
      <div className="flex gap-2">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </div>
  );
}
