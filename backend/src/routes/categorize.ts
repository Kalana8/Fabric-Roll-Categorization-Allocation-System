import { Router } from 'express';
import { categorizeRollsForRule } from '../services/categorizationService.js';

export const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const { ruleId } = req.body as { ruleId: string };
        const result = await categorizeRollsForRule(ruleId);
        res.json(result);
    } catch (err) {
        next(err);
    }
});


