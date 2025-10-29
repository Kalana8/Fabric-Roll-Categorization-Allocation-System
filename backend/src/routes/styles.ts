import { Router } from 'express';
import { listStyles, createStyle } from '../services/stylesService.js';

export const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        const styles = await listStyles();
        res.json(styles);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const style = await createStyle(req.body);
        res.status(201).json(style);
    } catch (err) {
        next(err);
    }
});


