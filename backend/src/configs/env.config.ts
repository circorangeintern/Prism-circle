import dotenv from 'dotenv';

dotenv.config();

const dbHost = process.env.DB_HOST ?? 'localhost';
const dbPort = Number(process.env.DB_PORT) || 3306;
const dbUser = process.env.DB_USER ?? 'root';
const dbPassword = process.env.DB_PASSWORD ?? '';
const dbName = process.env.DB_NAME ?? 'powerwatch';

const databaseUrl = `mysql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}`;

process.env.DATABASE_URL = databaseUrl;

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST ?? '0.0.0.0',

  db: {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    name: dbName,
  },

  databaseUrl,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
  },

  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  },

  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 5,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  },

  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  },

  admin: {
    firstName: process.env.ADMIN_FIRST_NAME ?? '',
    lastName: process.env.ADMIN_LAST_NAME ?? '',
    email: process.env.ADMIN_EMAIL ?? '',
    password: process.env.ADMIN_PASSWORD ?? '',
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ?? '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
  },
};
