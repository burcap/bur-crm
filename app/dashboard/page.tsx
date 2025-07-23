import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import PageHeader from '@/components/ui/PageHeader';

export default async function DashboardPage() {
  await auth(); // ensure login
  const totalSends = await prisma.emailLog.count();
  const totalClicks = await prisma.emailLog.count({ where: { clickedAt: { not: null } } });
  const clickRate = totalSends ? ((totalClicks / totalSends) * 100).toFixed(1) : '0';

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard label="Emails Sent" value={totalSends} />
        <StatCard label="Clicks" value={totalClicks} />
        <StatCard label="CTR" value={`${clickRate}%`} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}