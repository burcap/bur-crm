"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SendResult = {
  ok: boolean;
  attempted?: number;
  sent?: number;
  failedCount?: number;
  failed?: string[];
  error?: string;
};

export default function SendCampaignButton({ id }: { id: string }) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSend() {
    setSending(true);
    try {
      const res = await fetch(`/api/campaigns/${id}/send`, { method: "POST" });
      const data = (await res.json()) as SendResult;
      setResult({ ...data, ok: res.ok && data.ok !== false });
    } catch (error) {
      setResult({
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      });
    } finally {
      setSending(false);
      setOpen(true);
    }
  }

  function handleAcknowledge() {
    setOpen(false);
    router.push("/campaigns");
  }

  return (
    <>
      <Button type="button" onClick={handleSend} disabled={sending}>
        {sending ? "Sending…" : "Send Now"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{result?.ok ? "Campaign sent" : "Send failed"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            {result?.error && <p className="text-destructive">Error: {result.error}</p>}
            {typeof result?.attempted === "number" && <p>Attempted: {result.attempted}</p>}
            {typeof result?.sent === "number" && <p>Sent: {result.sent}</p>}
            {typeof result?.failedCount === "number" && <p>Failed: {result.failedCount}</p>}
            {result?.failed && result.failed.length > 0 && (
              <div>
                <p className="font-semibold">Failures</p>
                <ul className="list-disc list-inside space-y-1">
                  {result.failed.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleAcknowledge}>OK</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
