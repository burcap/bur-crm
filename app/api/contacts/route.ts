import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const contact = await prisma.contact.create({
    data: {
      businessName: body.businessName || null,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone || null,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      zip: body.zip || null,
      country: body.country || null,
    },
  });
  return NextResponse.json(contact, { status: 201 });
}
