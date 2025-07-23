import { prisma } from "@/lib/prisma";
import GroupsClient from "./_client";

export default async function GroupsPage() {
  const groups = await prisma.group.findMany({ orderBy: { name: "asc" } });
  return <GroupsClient initialGroups={groups} />;
}
