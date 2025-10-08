import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ logId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { logId } = await ctx.params; // ✅ await params
  await prisma.emailLog.update({
    where: { id: logId },
    data: { openedAt: new Date() },
  });

  // 1x1 transparent gif
  return new Response(
    Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64"),
    { headers: { "Content-Type": "image/gif", "Cache-Control": "no-store" } }
  );
}
