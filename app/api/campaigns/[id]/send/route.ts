
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const camp = await prisma.campaign.findUnique({ where: { id: params.id }});
  if (!camp) return NextResponse.json({error:'Not found'},{status:404});
  const groupIds = await prisma.campaignGroup.findMany({
  where: { campaignId: campaign.id },
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
