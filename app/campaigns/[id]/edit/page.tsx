'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from "@/components/editor/RichTextEditor";
import { toast } from 'sonner';

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    subject: '',
    fromEmail: '',
    htmlBody: '',
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/campaigns/${id}`);
      if (!res.ok) {
        toast.error('Failed to load campaign');
        router.push('/campaigns');
        return;
      }
      const data = await res.json();
      setForm({
        name: data.name ?? '',
        subject: data.subject ?? '',
        fromEmail: data.fromEmail ?? '',
        htmlBody: data.htmlBody ?? '',
      });
      setLoading(false);
    })();
  }, [id, router]);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      toast.success('Saved!');
      router.push(`/campaigns/${id}`);
    } else {
      toast.error('Save failed');
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold tracking-tight">Edit Campaign</h1>

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
      </div>

      <div className="flex gap-2">
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
