import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { buildApp } from './app.js';
import { env } from './configs/env.config.js';
import { prisma } from './configs/database.config.js';
import { ensureDatabaseExists } from './loaders/database.loader.js';
import { seedAdmin } from './loaders/seed.loader.js';

async function generatePrismaClient() {
  const clientPath = new URL('../node_modules/@prisma/client/index.js', import.meta.url);
  if (!existsSync(clientPath)) {
    console.log('Prisma client not found. Generating...');
    execSync('npx prisma generate', { stdio: 'inherit' });
  }
}

async function main() {
  await generatePrismaClient();

  await ensureDatabaseExists();

  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

  await prisma.$connect();
  console.log('Database connected successfully.');

  await seedAdmin();

  const app = await buildApp();

  await app.listen({ port: env.port, host: env.host });

  const address = app.server.address();
  const host = typeof address === 'string' ? address : address?.address;
  const port = typeof address === 'string' ? env.port : address?.port;
  console.log(`Server running at http://${host}:${port}`);
  console.log(`Swagger documentation at http://${host}:${port}/docs`);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
