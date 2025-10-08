#!/usr/bin/env node
// Usage:
//   pnpm run user:create -- --email 'admin@acme.com' --password 'S3cret!' --name 'Admin' --role ADMIN
// Or using env vars:
//   EMAIL='admin@acme.com' PASSWORD='S3cret!' ROLE=ADMIN pnpm run user:create

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { exit, argv, env } from 'node:process';

const prisma = new PrismaClient();

function getArg(flag) {
  const i = argv.indexOf(flag);
  if (i !== -1 && argv[i + 1]) return argv[i + 1];
  return null;
}

function usage(msg) {
  if (msg) console.error(`\nError: ${msg}\n`);
  console.log(`Create a user in the database.

Required:
  --email <email>         or EMAIL=...
  --password <password>   or PASSWORD=...

Optional:
  --name <name>           or NAME=...
  --role <USER|ADMIN>     or ROLE=USER

Examples:
  pnpm run user:create -- --email 'admin@acme.com' --password 'S3cret!' --name 'Admin' --role ADMIN
  EMAIL='admin@acme.com' PASSWORD='S3cret!' ROLE=ADMIN pnpm run user:create
`);
  exit(1);
}

async function main() {
  const email = getArg('--email') || env.EMAIL;
  const password = getArg('--password') || env.PASSWORD;
  const name = getArg('--name') || env.NAME || null;
  const role = (getArg('--role') || env.ROLE || 'USER').toUpperCase();

  if (!email) usage('Missing --email or EMAIL');
  if (!password) usage('Missing --password or PASSWORD');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) usage('Invalid email');
  if (password.length < 6) usage('Password must be at least 6 characters');
  if (!['USER', 'ADMIN'].includes(role)) usage('Role must be USER or ADMIN');

  const lower = email.toLowerCase();

  const exists = await prisma.user.findUnique({ where: { email: lower } });
  if (exists) {
    console.error('A user with that email already exists.');
    exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email: lower, name, role, passwordHash },
    select: { id: true, email: true, role: true, name: true, createdAt: true },
  });

  console.log('\n✅ User created:');
  console.table(user);
}

main()
  .catch((err) => {
    console.error('\nFailed to create user:', err?.message || err);
    exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
