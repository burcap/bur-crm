import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ logId: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const { logId } = await ctx.params; // ✅ await params
  const url = new URL(req.url);
  const dest = url.searchParams.get("u") || "https://burfinancial.com";

  await prisma.emailLog.update({
    where: { id: logId },
    data: { clickedAt: new Date() },
  });

  return NextResponse.redirect(dest);
}
