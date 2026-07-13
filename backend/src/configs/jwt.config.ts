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
  const match = expiresIn.match(/^(\d+)\s*([dhms])$/);
  if (!match) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const value = parseInt(match[1]!, 10);
  const unit = match[2]!;

  const multipliers: Record<string, number> = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };

  const multiplier = multipliers[unit] ?? 30 * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + value * multiplier);
}
