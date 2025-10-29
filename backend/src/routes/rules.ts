import { Router } from 'express';
import { createRule, listRules } from '../services/rulesService.js';

export const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        const rules = await listRules();
        res.json(rules);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const rule = await createRule(req.body);
        res.status(201).json(rule);
    } catch (err) {
        next(err);
    }
});


