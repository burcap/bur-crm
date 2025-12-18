import { prisma } from "@/lib/prisma";
import ContactsClient from "./_client";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      businessName: true,
      contactName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      zip: true,
      country: true,
      groups: { select: { group: { select: { id: true, name: true } } } },
    },
  });

  const groups = await prisma.group.findMany({ orderBy: { name: "asc" } });

  // Flatten groups
  const formatted = contacts.map(c => ({
    ...c,
    groupList: c.groups.map(g => g.group),
  }));

  return <ContactsClient initialContacts={formatted} allGroups={groups} />;
}
