/**
 * @file session.server.ts
 * @description Minimal cookie session for Hydrogen's cart handler.
 *
 * Provides get/set/unset/commit/destroy to satisfy the shape expected by
 * `createHydrogenContext({ session })` without importing a runtime
 * that may not exist in the installed package version.
 */

import {redirect} from '@remix-run/server-runtime';

// Simple typed session data

type SessionPayload = Record<string, string>;

// Use any-typed storage to avoid generics constraint fights
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SessionStorage = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SessionHandle = any;

export class AppSession {
  private storage: SessionStorage;
  private session: SessionHandle;

  constructor(storage: SessionStorage, session: SessionHandle) {
    this.storage = storage;
    this.session = session;
  }

  static async init(request: Request, secrets: string[]): Promise<AppSession> {
    // createCookieSessionStorage is available globally in Oxygen (Cloudflare Workers)
    // and via Miniflare in development. We access it from globalThis.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const csFactory = (globalThis as any).createCookieSessionStorage;

    if (!csFactory) {
      // Fallback: in-memory session for environments without global factory
      const memSession: SessionPayload = {};
      return new AppSession(null, memSession);
    }

    const storage = csFactory({
      cookie: {
        name: '__session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage
      .getSession(request.headers.get('Cookie'))
      .catch(() => storage.getSession());

    return new AppSession(storage, session);
  }

  get(key: string): string | undefined {
    if (this.session?.get) return this.session.get(key);
    return (this.session as SessionPayload)?.[key];
  }

  set(key: string, value: string): void {
    if (this.session?.set) this.session.set(key, value);
    else (this.session as SessionPayload)[key] = value;
  }

  unset(key: string): void {
    if (this.session?.unset) this.session.unset(key);
    else delete (this.session as SessionPayload)[key];
  }

  get cartId(): string | undefined {
    return this.get('cartId');
  }

  set cartId(cartId: string) {
    this.set('cartId', cartId);
  }

  get userId(): string | undefined {
    return this.get('userId');
  }

  set userId(userId: string) {
    this.set('userId', userId);
  }


  destroy(): Promise<string> {
    if (this.storage?.destroySession) return this.storage.destroySession(this.session);
    return Promise.resolve('');
  }

  commit(): Promise<string> {
    if (this.storage?.commitSession) return this.storage.commitSession(this.session);
    return Promise.resolve('');
  }
}

export async function createUserSession(userId: string, redirectTo: string) {
  // This is a bit tricky because we don't have direct access to the session instance here
  // without the request context. 
  // We'll need to handle this in the action or pass the session object.
  return redirect(redirectTo);
}

export async function getCustomerAccessToken(request: Request) {
  // Mocking this for now as we are using custom auth
  return null;
}

