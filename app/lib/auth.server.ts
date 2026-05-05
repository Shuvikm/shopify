/**
 * @file auth.server.ts
 * @description Session-based auth helpers — no JWT, no Node-only imports.
 *
 * JWT Bearer token auth was replaced with cookie sessions (context.session).
 * getUserFromRequest is kept as a stub so existing callers compile; all
 * routes that need auth should read context.session.get('userId') directly.
 */

export interface JWTPayload {
  userId: string;
  email: string;
}

export function verifyToken(_token: string): JWTPayload | null {
  return null;
}

export function getUserFromRequest(_request: Request): JWTPayload | null {
  return null;
}
