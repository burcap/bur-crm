import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { groupIds } = await req.json(); // string[]
  await prisma.campaignGroup.deleteMany({ where: { campaignId: params.id } }); // replace set
  await prisma.campaignGroup.createMany({
    data: groupIds.map((gid: string) => ({ campaignId: params.id, groupId: gid })),
    skipDuplicates: true,
  });
  return NextResponse.json({ ok: true });
}
