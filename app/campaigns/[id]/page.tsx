import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import SendCampaignButton from "./SendCampaignButton";


type Props = { params: Promise<{ id: string }> };

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params;     
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      logs: {
        include: { contact: true },
        orderBy: { sentAt: "desc" },
        take: 50, // limit for performance
      },
    },
  });

  if (!campaign) {
    return <div className="p-6">Campaign not found.</div>;
  }

  const sent = campaign.logs.length;
  const clicks = campaign.logs.filter((l) => l.clickedAt).length;
  const opens = campaign.logs.filter((l) => l.openedAt).length;
  const ctr = sent ? ((clicks / sent) * 100).toFixed(1) : "0";
  const openRate = sent ? ((opens / sent) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
        <div className="flex gap-2">
          <Link href={`/campaigns/${campaign.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <SendCampaignButton id={campaign.id} />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Metric label="Emails Sent" value={sent} />
        <Metric label="Opens" value={`${opens} (${openRate}%)`} />
        <Metric label="Clicks" value={`${clicks} (${ctr}%)`} />
        <Metric label="Status" value={campaign.status} />
      </div>

      {/* Content preview */}
      <Card>
        <CardHeader>
          <CardTitle>Email Preview</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h3 className="font-semibold mb-2">Subject: {campaign.subject}</h3>
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: campaign.htmlBody || "" }}
            />
        </CardContent>
      </Card>

      {/* Recent logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sends (latest 50)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Clicked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.contact?.email}</TableCell>
                  <TableCell>{log.sentAt.toLocaleString()}</TableCell>
                  <TableCell>{log.openedAt ? log.openedAt.toLocaleString() : "—"}</TableCell>
                  <TableCell>{log.clickedAt ? log.clickedAt.toLocaleString() : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle>More Info</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p className="text-sm text-muted-foreground">
            Created: {new Date(campaign.createdAt).toLocaleString()}
            </p>
            {campaign.startedAt && (
            <p className="text-sm text-muted-foreground">
                Started: {new Date(campaign.startedAt).toLocaleString()}
            </p>
            )}
            {campaign.completedAt && (
            <p className="text-sm text-muted-foreground">
                Completed: {new Date(campaign.completedAt).toLocaleString()}
            </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-bold">{value}</CardContent>
    </Card>
  );
}
