
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { rows } = await req.json();
  if (!Array.isArray(rows)) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const data = rows.map((r:any)=>({
    businessName: r.businessName ?? r["Business Name"] ?? null,
    contactName:  r.contactName  ?? r["Contact Name"] ?? "",
    email:        r.email        ?? r["Email"] ?? "",
    phone:        r.phone        ?? r["Phone"] ?? null,
    address:      r.address      ?? r["Address"] ?? null,
    city:         r.city         ?? r["City"] ?? null,
    state:        r.state        ?? r["State"] ?? null,
    zip:          r.zip          ?? r["Zip"] ?? null,
    country:      r.country      ?? r["Country"] ?? null
  }));

  await prisma.contact.createMany({ data, skipDuplicates: true });
  return NextResponse.json({ ok: true, imported: data.length });
}
