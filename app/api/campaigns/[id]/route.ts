// app/api/campaigns/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;               // ✅ await
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { groups: true },
  });
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(campaign);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;               // ✅ await
  const { name, subject, fromEmail, htmlBody } = await req.json();

  const updated = await prisma.campaign.update({
    where: { id },
    data: { name, subject, fromEmail, htmlBody },
  });
  return NextResponse.json(updated);
}
