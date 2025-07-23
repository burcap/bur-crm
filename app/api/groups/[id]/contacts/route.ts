import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { contactIds } = await req.json(); // string[]
  await prisma.contactGroup.createMany({
    data: contactIds.map((cid: string) => ({ contactId: cid, groupId: params.id })),
    skipDuplicates: true,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { contactId } = await req.json();
  await prisma.contactGroup.delete({ where: { contactId_groupId: { contactId, groupId: params.id } } });
  return NextResponse.json({ ok: true });
}
