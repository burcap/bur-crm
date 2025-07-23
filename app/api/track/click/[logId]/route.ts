import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET(req: Request, { params }: { params: { logId: string } }) {
  const url = new URL(req.url);
  const dest = url.searchParams.get('u');
  await prisma.emailLog.update({ where: { id: params.logId }, data: { clickedAt: new Date() } });
  return NextResponse.redirect(dest ?? 'https://example.com');
}