import { prisma } from "@/lib/prisma";
import GroupDetailClient from "./_client";

type PageProps = { params: Promise<{ id: string }> };

export default async function GroupDetail({ params }: PageProps) {
  const { id } = await params; // ✅ await

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      members: {
        include: { contact: true },
        orderBy: { contact: { createdAt: "desc" } },
      },
    },
  });

  if (!group) return <div className="p-6">Not found</div>;

  const contacts = group.members.map((m) => m.contact);
  return <GroupDetailClient groupId={group.id} groupName={group.name} contacts={contacts} />;
}
