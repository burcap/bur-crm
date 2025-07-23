import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const groups = await prisma.group.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(groups);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const g = await prisma.group.create({ data: { name } });
  return NextResponse.json(g, { status: 201 });
}
