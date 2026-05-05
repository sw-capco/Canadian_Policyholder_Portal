import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import claimsRouter from './routes/claims.js';
import policiesRouter from './routes/policies.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/claims', claimsRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/users', usersRouter);

const port = Number(process.env.PORT || 5000);
const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
if (!isTestEnv) {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

export default app;
