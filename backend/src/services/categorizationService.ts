import { prisma } from './db.js';

export async function categorizeRollsForRule(ruleId: string) {
    const rule = await prisma.rule.findUnique({ where: { id: ruleId }, include: { style: true } });
    if (!rule) throw new Error('Rule not found');

    const rolls = await prisma.roll.findMany({ where: { styleId: rule.styleId } });

    const positiveShrinkage: typeof rolls = [];
    const negativeShrinkage: typeof rolls = [];

    for (const roll of rolls) {
        if (roll.widthShrinkage >= 0) positiveShrinkage.push(roll);
        else negativeShrinkage.push(roll);
    }

    const withinWidth = (rollWidth: number, styleWidth: number) => {
        const diff = rollWidth - styleWidth;
        return diff >= rule.widthToleranceMin && diff <= rule.widthToleranceMax;
    };

    const withinShrink = (rollShrink: number, styleShrink: number) => {
        const diff = rollShrink - styleShrink;
        return diff >= rule.shrinkageToleranceMin && diff <= rule.shrinkageToleranceMax;
    };

    // Assuming style has targetWidth and targetShrinkage; if not, use 0 as baseline.
    const targetWidth = rule.style.targetWidth ?? 0;
    const targetShrinkage = rule.style.targetShrinkage ?? 0;

    const filtered = rolls.filter((r) => withinWidth(r.fabricWidth, targetWidth) && withinShrink(r.widthShrinkage, targetShrinkage));

    // Upsert categorized_rolls mapping
    await prisma.categorizedRoll.deleteMany({ where: { ruleId } });
    await prisma.categorizedRoll.createMany({
        data: filtered.map((r) => ({ ruleId, rollId: r.id }))
    });

    return { ruleId, styleId: rule.styleId, positiveShrinkage: positiveShrinkage.map((r) => r.id), negativeShrinkage: negativeShrinkage.map((r) => r.id), categorizedRollIds: filtered.map((r) => r.id) };
}


