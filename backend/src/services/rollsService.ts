import { z } from 'zod';
import { prisma } from './db.js';

const rollSchema = z.object({
    styleId: z.string().min(1),
    rollId: z.string().min(1),
    fabricWidth: z.number().positive(),
    widthShrinkage: z.number(),
    lengthM: z.number().positive(),
    location: z.string().min(1)
});

export async function listRolls() {
    return prisma.roll.findMany({ include: { style: true }, orderBy: { createdAt: 'desc' } });
}

export async function createRoll(input: unknown) {
    const data = rollSchema.parse(input);
    return prisma.roll.create({ data });
}


