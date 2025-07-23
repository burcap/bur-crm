import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// GET one campaign (used by edit page)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, subject: true, fromEmail: true, htmlBody: true, status: true },
  });
  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(campaign);
}

// PATCH update
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, subject, fromEmail, htmlBody } = body;

  try {
    const updated = await prisma.campaign.update({
      where: { id: params.id },
      data: { name, subject, fromEmail, htmlBody },
      select: { id: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}
