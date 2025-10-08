
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
       <Link href="/campaigns/new"> <Button>New Campaign</Button></Link>

      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map(c => (
            <TableRow key={c.id}>
              <TableCell><Link className='underline font-semibold' href={`/campaigns/${c.id}`}>{c.name}</Link></TableCell>
              <TableCell>{c.subject}</TableCell>
              <TableCell>
                <Badge variant={
                  c.status === "COMPLETED" ? "default"
                  : c.status === "STARTED" ? "secondary"
                  : c.status === "FAILED" ? "destructive"
                  : "outline"
                }>
                  {c.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
