import { z } from 'zod';
import { prisma } from './db.js';

const ruleSchema = z.object({
    styleId: z.string().min(1),
    widthToleranceMin: z.number(),
    widthToleranceMax: z.number(),
    shrinkageToleranceMin: z.number(),
    shrinkageToleranceMax: z.number()
});

export async function listRules() {
    return prisma.rule.findMany({ include: { style: true }, orderBy: { createdAt: 'desc' } });
}

export async function createRule(input: unknown) {
    const data = ruleSchema.parse(input);
    // Auto-generated RuleID handled by DB via cuid
    return prisma.rule.create({ data });
}


