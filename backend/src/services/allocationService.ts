import { prisma } from './db.js';

export async function allocateRequirement(params: { styleId: string; requiredLength: number }) {
    const { styleId, requiredLength } = params;

    // Prioritize balance rolls first (rolls with balance flag)
    const categorized = await prisma.categorizedRoll.findMany({
        where: { roll: { styleId } },
        include: { roll: true }
    });

    const available = categorized
        .map((c) => c.roll)
        .filter((r) => r.lengthM > 0)
        .sort((a, b) => a.lengthM - b.lengthM);

    const chosen = available.find((r) => r.lengthM >= requiredLength);
    if (!chosen) {
        return { allocated: false, reason: 'No suitable roll found' };
    }

    const newLength = chosen.lengthM - requiredLength;

    const updated = await prisma.$transaction(async (tx) => {
        const allocation = await tx.allocationLog.create({
            data: {
                styleId,
                rollId: chosen.id,
                consumedLength: requiredLength,
                balanceAfter: Math.max(newLength, 0)
            }
        });

        if (newLength <= 0) {
            await tx.roll.update({ where: { id: chosen.id }, data: { lengthM: 0, isActive: false } });
        } else {
            await tx.roll.update({ where: { id: chosen.id }, data: { lengthM: newLength, isBalance: true } });
        }

        return allocation;
    });

    return {
        allocated: true,
        rollId: chosen.id,
        newLength,
        logId: updated.id
    };
}


