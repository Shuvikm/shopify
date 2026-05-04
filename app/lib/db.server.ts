import {PrismaClient} from '@prisma/client/edge';
import {PrismaPg} from '@prisma/adapter-pg';
import pg from 'pg';

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({connectionString});
  const adapter = new PrismaPg(pool);
  return new PrismaClient({adapter});
}

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = createPrismaClient();
  }
  prisma = global.__db__;
}

export {prisma};



