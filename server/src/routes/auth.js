import express from 'express';
import { signToken } from '../lib/jwt.js';

const router = express.Router();

const USERS = [
  {
    id: 'u1',
    email: 'policyholder@example.com',
    password: 'password123',
    fullName: 'Alex Policyholder',
    policyNumber: 'POL123456',
    mfaEnabled: false,
  },
  {
    id: 'u2',
    email: 'mfa@example.com',
    password: 'password123',
    fullName: 'Morgan MFA',
    policyNumber: 'POL123456',
    mfaEnabled: true,
  },
];

function findUser(email) {
  return USERS.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
}

router.post('/signin', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(422).json({ success: false, error: 'Email and password required' });

  const user = findUser(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const safeUser = { id: user.id, email: user.email, fullName: user.fullName, policyNumber: user.policyNumber };

  if (user.mfaEnabled) {
    const mfaToken = signToken({ sub: user.id, stage: 'mfa' }, { expiresIn: '5m' });
    return res.json({ success: true, mfa_required: true, mfa_token: mfaToken, user: safeUser });
  }

  const token = signToken({ sub: user.id, email: user.email });
  return res.json({ success: true, token, mfa_required: false, user: safeUser });
});

router.post('/verify-mfa', (req, res) => {
  const { mfaToken, code } = req.body || {};
  if (!mfaToken || !code) return res.status(422).json({ success: false, error: 'mfaToken and code required' });

  // Demo implementation: accept only 123456
  if (String(code) !== '123456') return res.status(401).json({ success: false, error: 'Invalid MFA code' });

  // In a real implementation, verify mfaToken and fetch user; keep deterministic here.
  const user = USERS.find((u) => u.mfaEnabled) || USERS[0];
  const safeUser = { id: user.id, email: user.email, fullName: user.fullName, policyNumber: user.policyNumber };

  const token = signToken({ sub: user.id, email: user.email });
  return res.json({ success: true, token, user: safeUser });
});

export default router;

