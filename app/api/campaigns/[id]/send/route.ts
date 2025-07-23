
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { NextResponse } from 'next/server';

type Props = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Props) {
   const { id } = await params;    
  const camp = await prisma.campaign.findUnique({ where: { id }});
  if (!camp) return NextResponse.json({error:'Not found'},{status:404});
  const groupIds = await prisma.campaignGroup.findMany({
  where: { campaignId: id },
  select: { groupId: true }
});
const contacts = groupIds.length
  ? await prisma.contact.findMany({
      where: { groups: { some: { groupId: { in: groupIds.map(g => g.groupId) } } } }
    })
  : await prisma.contact.findMany(); // fallback: everyone
  for (const contact of contacts) {
    await resend.emails.send({from:camp.fromEmail,to:contact.email,subject:camp.subject,html:`<p>Hello ${contact.contactName}</p>`});
  }
  return NextResponse.json({ok:true});
}
