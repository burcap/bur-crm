import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, subject, fromEmail, htmlBody } = await req.json();

  const campaign = await prisma.campaign.create({
    data: {
      name,
      subject,
      fromEmail,
      htmlBody,
      ownerId: session.user.id, // ← required
    },
    select: { id: true },
  });

  return NextResponse.json({ id: campaign.id });
}