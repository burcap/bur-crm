import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;                         // 👈 await
  const { contactIds } = await req.json() as { contactIds: string[] };

  if (!Array.isArray(contactIds) || !contactIds.length) {
    return NextResponse.json({ ok: true });
  }

  await prisma.contactGroup.createMany({
    data: contactIds.map((cid) => ({ contactId: cid, groupId: id })),
    skipDuplicates: true,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;                         // 👈 await
  const { contactId } = await req.json() as { contactId: string };

  if (!contactId) return NextResponse.json({ error: "contactId required" }, { status: 400 });

  await prisma.contactGroup.delete({
    where: { contactId_groupId: { contactId, groupId: id } },
  });

  return NextResponse.json({ ok: true });
}
