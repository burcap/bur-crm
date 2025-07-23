import { prisma } from '@/lib/prisma';
export async function GET(_: Request, { params }: { params: { logId: string } }) {
  await prisma.emailLog.update({ where: { id: params.logId }, data: { openedAt: new Date() } });
  // return 1×1 pixel
  return new Response(Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64'), {
    headers: { 'Content-Type': 'image/gif' }
  });
}