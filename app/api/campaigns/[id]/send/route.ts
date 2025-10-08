import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

type Ctx = { params: Promise<{ id: string }> };

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


export async function POST(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { groups: true },
  });

  if (!campaign) {
    return NextResponse.json({ ok: false, error: "Campaign not found" }, { status: 404 });
  }

  // Mark as STARTED and set startedAt now
  await prisma.campaign.update({
    where: { id },
    data: { status: "STARTED", startedAt: new Date() },
  });

  // Resolve recipients
  let contacts = [];
  if (campaign.groups.length) {
    contacts = await prisma.contact.findMany({
      where: {
        groups: {
          some: { groupId: { in: campaign.groups.map((g) => g.groupId) } },
        },
      },
    });
  } else {
    contacts = await prisma.contact.findMany();
  }

  if (!contacts.length) {
    // leave completedAt null since nothing was sent
    return NextResponse.json({
      ok: false,
      error: "No contacts matched this campaign.",
      attempted: 0,
      sent: 0,
      failedCount: 0,
      failed: [],
    });
  }

  const attempted = contacts.length;

  const results = await Promise.allSettled(
    contacts.map(async (contact) => {
    const html =
      campaign.htmlBody && campaign.htmlBody.trim().length > 0
        ? campaign.htmlBody
        : `<p>Hello ${contact.contactName ? escapeHtml(contact.contactName) : ""},</p>`; // simple fallback


      const { data, error } = await resend.emails.send({
        from: campaign.fromEmail,
        to: contact.email,
        subject: campaign.subject,
        html,
      });

      if (error) throw new Error(error.message);

      await prisma.emailLog.create({
        data: {
          campaignId: id,
          contactId: contact.id,
          stepIndex: 0,
          sentAt: new Date(),
        },
      });

      return data?.id ?? null;
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results
    .filter((r) => r.status === "rejected")
    .map((r) => (r as PromiseRejectedResult).reason?.message ?? "unknown");

  const finalStatus =
    sent > 0 ? "COMPLETED" : attempted > 0 ? "FAILED" : "STARTED";

  await prisma.campaign.update({
    where: { id },
    data: {
      status: finalStatus,
      // only stamp completedAt if at least one email went out successfully
      completedAt: sent > 0 ? new Date() : null,
    },
  });

  return NextResponse.json({
    ok: failed.length === 0,
    attempted,
    sent,
    failedCount: failed.length,
    failed,
  });
}
