import jwt from 'jsonwebtoken';
import { env } from './env.config.js';

interface AccessTokenPayload {
  userId: string;
  role: string;
}

interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.jwt.accessSecret) as Record<string, unknown>;
  if (typeof payload.userId !== 'string' || typeof payload.role !== 'string') {
    throw new jwt.JsonWebTokenError('Invalid access token payload.');
  }
  return payload as unknown as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, env.jwt.refreshSecret) as Record<string, unknown>;
  if (typeof payload.userId !== 'string' || typeof payload.tokenId !== 'string') {
    throw new jwt.JsonWebTokenError('Invalid refresh token payload.');
  }
  return payload as unknown as RefreshTokenPayload;
}

export function getRefreshTokenExpiryDate(): Date {
  const expiresIn = env.jwt.refreshExpiresIn;

  // Handle numeric strings (seconds)
  const numericMatch = expiresIn.match(/^(\d+)$/);
  if (numericMatch) {
    return new Date(Date.now() + parseInt(numericMatch[1]!, 10) * 1000);
  }

  // Handle formats like "30d", "15m", "1h", "45s"
  const shortMatch = expiresIn.match(/^(\d+)\s*([dhms])$/);
  if (shortMatch) {
    const value = parseInt(shortMatch[1]!, 10);
    const unit = shortMatch[2]!;
    const multipliers: Record<string, number> = {
      d: 24 * 60 * 60 * 1000,
      h: 60 * 60 * 1000,
      m: 60 * 1000,
      s: 1000,
    };
    return new Date(Date.now() + value * (multipliers[unit] ?? 30 * 24 * 60 * 60 * 1000));
  }

  // Handle formats like "7 days", "2 hours", "30 minutes", "45 seconds"
  const longMatch = expiresIn.match(/^(\d+)\s*(day|hour|minute|second)s?$/);
  if (longMatch) {
    const value = parseInt(longMatch[1]!, 10);
    const unit = longMatch[2]!;
    const multipliers: Record<string, number> = {
      day: 24 * 60 * 60 * 1000,
      hour: 60 * 60 * 1000,
      minute: 60 * 1000,
      second: 1000,
    };
    return new Date(Date.now() + value * (multipliers[unit] ?? 30 * 24 * 60 * 60 * 1000));
  }

  // Default fallback: 30 days
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}
