/**
 * In-memory mock database — edge-runtime safe (no Node.js / Prisma imports).
 *
 * Schema mirrors prisma/schema.prisma exactly so swapping to a real driver
 * (Neon, D1, PlanetScale) is a one-file change.
 *
 * Data lives for the lifetime of the Miniflare worker process in dev, or the
 * Worker instance in production. For persistence, replace with:
 *   import {neon} from '@neondatabase/serverless';
 *   import {PrismaNeon} from '@prisma/adapter-neon';
 *   import {PrismaClient} from '@prisma/client';
 */

// ── Types (mirror schema.prisma) ─────────────────────────────────────────────

export type User = {
  id: string;
  email: string;
  password: string;
  name: string | null;
  country: string | null;
  verified: boolean;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  id: string;
  userId: string;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  bio: string | null;
  preferences: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Like = {
  id: string;
  userId: string;
  productId: string;
  category: string | null;
  createdAt: Date;
};

export type OTPRecord = {
  email: string;
  type: string;
  otp: string;
  verified: boolean;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
};

// ── In-memory stores ──────────────────────────────────────────────────────────

const _users: User[] = [];
const _profiles: UserProfile[] = [];
const _likes: Like[] = [];
const _otps: OTPRecord[] = [];

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}

// ── prisma.user ───────────────────────────────────────────────────────────────

const userModel = {
  async findUnique({where}: {where: {email?: string; id?: string}}): Promise<(User & {profile?: UserProfile | null}) | null> {
    const user = _users.find(
      (u) => (where.email && u.email === where.email) || (where.id && u.id === where.id),
    ) ?? null;
    if (!user) return null;
    return {...user, profile: _profiles.find((p) => p.userId === user.id) ?? null};
  },

  async create({data}: {
    data: {
      email: string;
      password: string;
      name?: string | null;
      country?: string | null;
      verified?: boolean;
      isPremium?: boolean;
      profile?: {create: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>};
    };
  }): Promise<User & {profile: UserProfile | null}> {
    const now = new Date();
    const user: User = {
      id: uid(),
      email: data.email,
      password: data.password,
      name: data.name ?? null,
      country: data.country ?? null,
      verified: data.verified ?? false,
      isPremium: data.isPremium ?? false,
      createdAt: now,
      updatedAt: now,
    };
    _users.push(user);

    let profile: UserProfile | null = null;
    if (data.profile?.create) {
      profile = {
        id: uid(),
        userId: user.id,
        phone: data.profile.create.phone ?? null,
        address: data.profile.create.address ?? null,
        avatar: data.profile.create.avatar ?? null,
        bio: data.profile.create.bio ?? null,
        preferences: data.profile.create.preferences ?? null,
        createdAt: now,
        updatedAt: now,
      };
      _profiles.push(profile);
    }

    return {...user, profile};
  },

  async update({where, data}: {
    where: {email?: string; id?: string};
    data: Partial<Omit<User, 'id' | 'createdAt'>>;
  }): Promise<User> {
    const user = _users.find(
      (u) => (where.email && u.email === where.email) || (where.id && u.id === where.id),
    );
    if (!user) throw new Error('User not found');
    Object.assign(user, {...data, updatedAt: new Date()});
    return user;
  },
};

// ── prisma.userProfile ────────────────────────────────────────────────────────

const userProfileModel = {
  async findUnique({where}: {where: {userId?: string; id?: string}}): Promise<UserProfile | null> {
    return (
      _profiles.find(
        (p) => (where.userId && p.userId === where.userId) || (where.id && p.id === where.id),
      ) ?? null
    );
  },

  async upsert({where, create, update}: {
    where: {userId: string};
    create: {userId: string} & Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>;
    update: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt'>>;
  }): Promise<UserProfile> {
    const existing = _profiles.find((p) => p.userId === where.userId);
    if (existing) {
      Object.assign(existing, {...update, updatedAt: new Date()});
      return existing;
    }
    const now = new Date();
    const profile: UserProfile = {
      id: uid(),
      userId: create.userId,
      phone: create.phone ?? null,
      address: create.address ?? null,
      avatar: create.avatar ?? null,
      bio: create.bio ?? null,
      preferences: create.preferences ?? null,
      createdAt: now,
      updatedAt: now,
    };
    _profiles.push(profile);
    return profile;
  },

  async update({where, data}: {
    where: {userId: string};
    data: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt'>>;
  }): Promise<UserProfile> {
    const profile = _profiles.find((p) => p.userId === where.userId);
    if (!profile) throw new Error('Profile not found');
    Object.assign(profile, {...data, updatedAt: new Date()});
    return profile;
  },
};

// ── prisma.oTP ────────────────────────────────────────────────────────────────

const otpModel = {
  async upsert({where, create, update}: {
    where: {email_type: {email: string; type: string}};
    create: Omit<OTPRecord, 'createdAt'>;
    update: Partial<OTPRecord>;
  }): Promise<OTPRecord> {
    const existing = _otps.find(
      (o) => o.email === where.email_type.email && o.type === where.email_type.type,
    );
    if (existing) {
      Object.assign(existing, update);
      return existing;
    }
    const record: OTPRecord = {...create, createdAt: new Date()};
    _otps.push(record);
    return record;
  },

  async findUnique({where}: {where: {email_type: {email: string; type: string}}}): Promise<OTPRecord | null> {
    return (
      _otps.find(
        (o) => o.email === where.email_type.email && o.type === where.email_type.type,
      ) ?? null
    );
  },

  async delete({where}: {where: {email_type: {email: string; type: string}}}): Promise<void> {
    const idx = _otps.findIndex(
      (o) => o.email === where.email_type.email && o.type === where.email_type.type,
    );
    if (idx !== -1) _otps.splice(idx, 1);
  },
};

// ── prisma.like ───────────────────────────────────────────────────────────────

const likeModel = {
  async findFirst({where}: {where: {userId?: string; productId?: string}}): Promise<Like | null> {
    return (
      _likes.find(
        (l) =>
          (!where.userId || l.userId === where.userId) &&
          (!where.productId || l.productId === where.productId),
      ) ?? null
    );
  },
  async findMany({where, take}: {where?: {userId?: string}; take?: number; orderBy?: unknown}): Promise<Like[]> {
    let results = _likes.filter((l) => !where?.userId || l.userId === where.userId);
    if (take) results = results.slice(0, take);
    return results;
  },
  async create({data}: {data: {userId: string; productId: string; category?: string | null}}): Promise<Like> {
    const like: Like = {id: uid(), createdAt: new Date(), category: data.category ?? null, userId: data.userId, productId: data.productId};
    _likes.push(like);
    return like;
  },
  async deleteMany({where}: {where: {userId?: string; productId?: string}}): Promise<{count: number}> {
    const before = _likes.length;
    const keep = _likes.filter(
      (l) =>
        (where.userId ? l.userId !== where.userId : true) ||
        (where.productId ? l.productId !== where.productId : true),
    );
    _likes.length = 0;
    _likes.push(...keep);
    return {count: before - _likes.length};
  },
};

// ── Public prisma-compatible client ───────────────────────────────────────────

export const prisma = {
  user: userModel,
  userProfile: userProfileModel,
  oTP: otpModel,
  like: likeModel,
};

export async function getPrisma() {
  return prisma;
}
