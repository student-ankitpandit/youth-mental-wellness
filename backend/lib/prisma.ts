import { PrismaClient } from "./generated/prisma";

const GlobalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = GlobalForPrisma.prisma || new PrismaClient()

if(process.env.NODE_ENV !== 'production') GlobalForPrisma.prisma = prisma 

export default prisma


