import { prisma } from "@/lib/prisma";
import ContactsClient from "./_client";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, businessName: true, contactName: true, email: true, phone: true, city: true, state: true },
  });
  const groups = await prisma.group.findMany({ orderBy: { name: "asc" } });
  return <ContactsClient initialContacts={contacts} allGroups={groups} />;
}
