import { prisma } from "@/lib/prisma";
import GroupDetailClient from "./_client";

export default async function GroupDetail({ params }: { params: { id: string } }) {
  const group = await prisma.group.findUnique({
    where: { id: params.id },
    include: {
      members: { include: { contact: true }, orderBy: { contact: { createdAt: "desc" } } },
    },
  });
  if (!group) return <div className="p-6">Not found</div>;

  // Flatten
  const contacts = group.members.map((m) => m.contact);

  return <GroupDetailClient groupId={group.id} groupName={group.name} contacts={contacts} />;
}
