import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { prisma } from '../configs/database.config.js';
import { env } from '../configs/env.config.js';

export async function seedAdmin(): Promise<void> {
  if (!env.admin.email) {
    console.log('No admin credentials configured. Skipping admin seed.');
    return;
  }

  const normalizedEmail = env.admin.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    console.log('Admin user already exists. Skipping seed.');
    return;
  }

  const passwordHash = await bcrypt.hash(env.admin.password, env.bcrypt.saltRounds);

  await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      firstName: env.admin.firstName,
      lastName: env.admin.lastName,
      email: normalizedEmail,
      passwordHash,
      role: 'ADMIN',
      emailVerified: true,
      notificationEnabled: false,
    },
  });

  console.log('Admin user seeded successfully.');
}
