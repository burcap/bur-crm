import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const sanitize = (value: any) => {
  if (value === undefined) return undefined;
  return value === "" ? null : value;
};

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await req.json();
  const { id } = await params;

  const data: Record<string, any> = {};
  [
    "businessName",
    "contactName",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "country",
  ].forEach((key) => {
    const val = sanitize((body as any)[key]);
    if (val !== undefined) data[key] = val;
  });

  if (!data.contactName || !data.email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  try {
    const contact = await prisma.contact.update({
      where: { id },
      data,
    });
    return NextResponse.json(contact);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}
