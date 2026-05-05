/**
 * Edge-runtime JWT helpers using `jose` (Web Crypto API — Miniflare/Cloudflare Workers safe).
 * Drop-in replacement for the old `jsonwebtoken` implementation.
 */
import {SignJWT, jwtVerify} from 'jose';

export interface JWTPayload {
  userId: string;
  email: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const {payload} = await jwtVerify(token, getSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
