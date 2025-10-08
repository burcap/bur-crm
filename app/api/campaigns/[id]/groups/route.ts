import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params; // ✅ await the params
  const { groupIds } = (await req.json()) as { groupIds?: string[] };
  await prisma.campaignGroup.deleteMany({ where: { campaignId: id } }); // replace set
  await prisma.campaignGroup.createMany({
    data: groupIds.map((gid: string) => ({ campaignId: id, groupId: gid })),
    skipDuplicates: true,
  });
  return NextResponse.json({ ok: true });
}
