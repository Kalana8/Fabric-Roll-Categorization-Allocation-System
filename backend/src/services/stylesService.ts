import { z } from 'zod';
import { prisma } from './db.js';

const styleSchema = z.object({
    name: z.string().min(1),
    code: z.string().min(1)
});

export async function listStyles() {
    return prisma.style.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createStyle(input: unknown) {
    const data = styleSchema.parse(input);
    return prisma.style.create({ data });
}


