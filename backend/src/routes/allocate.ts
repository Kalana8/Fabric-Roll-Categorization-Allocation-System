import { Router } from 'express';
import { allocateRequirement } from '../services/allocationService.js';

export const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const { styleId, requiredLength } = req.body as { styleId: string; requiredLength: number };
        const result = await allocateRequirement({ styleId, requiredLength });
        res.json(result);
    } catch (err) {
        next(err);
    }
});


