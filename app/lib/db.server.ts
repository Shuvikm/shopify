/**
 * @file db.server.ts
 * @description In-memory mock database — no Node/Prisma imports, edge-runtime safe.
 *
 * All callers use getPrisma() or prisma directly. Data lives only for the
 * lifetime of the Miniflare worker process (dev) or the Worker instance (prod).
 * Swap out with a real driver (D1, PlanetScale, Neon) when ready.
 */

type User = {id: string; email: string; name: string; password: string};
type Like = {id: string; userId: string; productId: string; createdAt: Date};

const _users: User[] = [];
const _likes: Like[] = [];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const prisma = {
  user: {
    async findUnique({where}: {where: {email?: string; id?: string}}): Promise<User | null> {
      return (
        _users.find(
          (u) => (where.email && u.email === where.email) || (where.id && u.id === where.id),
        ) ?? null
      );
    },
    async create({data}: {data: {email: string; password: string; name?: string}}): Promise<User> {
      const user: User = {id: uid(), email: data.email, password: data.password, name: data.name ?? ''};
      _users.push(user);
      return user;
    },
  },

  like: {
    async findFirst({where}: {where: {userId?: string; productId?: string}}): Promise<Like | null> {
      return (
        _likes.find(
          (l) =>
            (!where.userId || l.userId === where.userId) &&
            (!where.productId || l.productId === where.productId),
        ) ?? null
      );
    },
    async findMany({
      where,
      take,
    }: {
      where?: {userId?: string};
      take?: number;
      orderBy?: unknown;
    }): Promise<Like[]> {
      let results = _likes.filter((l) => !where?.userId || l.userId === where.userId);
      if (take) results = results.slice(0, take);
      return results;
    },
    async create({data}: {data: {userId: string; productId: string}}): Promise<Like> {
      const like: Like = {id: uid(), userId: data.userId, productId: data.productId, createdAt: new Date()};
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
  },
};

export async function getPrisma() {
  return prisma;
}
