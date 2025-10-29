import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { app } from './app.js';

const port = Number(process.env.PORT ?? 4000);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});


