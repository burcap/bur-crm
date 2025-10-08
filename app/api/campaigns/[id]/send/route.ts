// app/api/campaigns/[id]/send/route.ts
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend"; // If you switched to getResend(), swap below accordingly
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Prisma requires Node runtime

type Ctx = { params: Promise<{ id: string }> };

const BASE = process.env.NEXT_PUBLIC_APP_URL!;
function ensureBase() {
  if (!BASE) throw new Error("Missing NEXT_PUBLIC_APP_URL");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Wrap every anchor href with our tracking click URL
function rewriteLinks(html: string, logId: string) {
  // naive, effective: replace href="..."
  return html.replace(
    /href="([^"]+)"/gi,
    (_m, href) => `href="${BASE}/api/track/click/${logId}?u=${encodeURIComponent(href)}"`
  );
}

// Append 1x1 open pixel
function addOpenPixel(html: string, logId: string) {
  const pixel = `<img src="${BASE}/api/track/open/${logId}" alt="" width="1" height="1" style="display:block;opacity:0" />`;
  return /<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${pixel}</body>`) : html + pixel;
}

export async function POST(_req: Request, ctx: Ctx) {
  ensureBase();

  const { id } = await ctx.params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { groups: true },
  });

  if (!campaign) {
    return NextResponse.json({ ok: false, error: "Campaign not found" }, { status: 404 });
  }

  // Mark as STARTED
  await prisma.campaign.update({
    where: { id },
    data: { status: "STARTED", startedAt: new Date() },
  });

  // Resolve recipients
  const contacts = campaign.groups.length
    ? await prisma.contact.findMany({
        where: {
          groups: { some: { groupId: { in: campaign.groups.map((g) => g.groupId) } } },
        },
      })
    : await prisma.contact.findMany();

  if (!contacts.length) {
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
      // 1) Create log first to get stable id for tracking URLs
      const log = await prisma.emailLog.create({
        data: {
          campaign: { connect: { id } },          // 👈
          contact:  { connect: { id: contact.id } }, // 👈
          stepIndex: 0,
          sentAt: new Date(),
          },
        select: { id: true },
      });

      // 2) Build HTML
      const baseHtml =
        campaign.htmlBody && campaign.htmlBody.trim().length > 0
          ? campaign.htmlBody
          : `<p>Hello ${contact.contactName ? escapeHtml(contact.contactName) : ""},</p>`;

      // 3) Inject tracking
      const withClickWrapped = rewriteLinks(baseHtml, log.id);
      const html = addOpenPixel(withClickWrapped, log.id);

      // 4) Send
      const { data, error } = await resend.emails.send({
        from: campaign.fromEmail, // must use a verified domain in Resend
        to: contact.email,
        subject: campaign.subject,
        html, // must be a string
      });

      if (error) throw new Error(error.message);

      // 5) Mark as sent and save provider id if desired
      await prisma.emailLog.update({
        where: { id: log.id },
        data: {
          sentAt: new Date(),
          // providerMessageId: (data as any)?.id ?? null, // add this field to schema if you want
        },
      });

      return data?.id ?? null;
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results
    .filter((r) => r.status === "rejected")
    .map((r) => (r as PromiseRejectedResult).reason?.message ?? "unknown");

  // Final status
  await prisma.campaign.update({
    where: { id },
    data: {
      status: sent > 0 ? "COMPLETED" : "FAILED",
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
