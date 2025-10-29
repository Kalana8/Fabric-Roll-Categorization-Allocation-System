import { Router } from 'express';
import { createRoll, listRolls } from '../services/rollsService.js';

export const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        const rolls = await listRolls();
        res.json(rolls);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const roll = await createRoll(req.body);
        res.status(201).json(roll);
    } catch (err) {
        next(err);
    }
});


