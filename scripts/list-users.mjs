#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
try {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, name: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  console.table(users);
} finally {
  await prisma.$disconnect();
}
