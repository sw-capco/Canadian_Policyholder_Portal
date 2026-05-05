import express from 'express';
import { signToken } from '../lib/jwt.js';
import requireAuth from '../middleware/requireAuth.js';
import { findUserByEmail, findUserById, toSafeUser, updateUserPassword } from '../mock/data.js';

const router = express.Router();

router.post('/signin', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(422).json({ success: false, error: 'Email and password required' });

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const safeUser = toSafeUser(user);

  if (user.mfaEnabled) {
    const mfaToken = signToken({ sub: user.id, stage: 'mfa' }, { expiresIn: '5m' });
    return res.json({ success: true, mfa_required: true, mfa_token: mfaToken, user: safeUser });
  }

  const token = signToken({ sub: user.id, email: user.email, policyNumbers: user.policyNumbers });
  return res.json({ success: true, token, mfa_required: false, user: safeUser });
});

router.post('/verify-mfa', (req, res) => {
  const { mfaToken, code } = req.body || {};
  if (!mfaToken || !code) return res.status(422).json({ success: false, error: 'mfaToken and code required' });

  // Demo implementation: accept only 123456
  if (String(code) !== '123456') return res.status(401).json({ success: false, error: 'Invalid MFA code' });

  // In a real implementation, verify mfaToken and fetch user; keep deterministic here.
  const user = findUserByEmail('mfa@example.com') || findUserByEmail('policyholder@example.com');
  const safeUser = toSafeUser(user);

  const token = signToken({ sub: user.id, email: user.email, policyNumbers: user.policyNumbers });
  return res.json({ success: true, token, user: safeUser });
});

router.post('/change-password', requireAuth, (req, res) => {
  const userId = req.user?.sub;
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(422).json({ success: false, error: 'currentPassword and newPassword required' });
  }

  const user = findUserById(userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  if (user.password !== currentPassword) {
    return res.status(401).json({ success: false, error: 'Current password is incorrect' });
  }

  const next = String(newPassword);
  const hasLetter = /[A-Za-z]/.test(next);
  const hasNumber = /\d/.test(next);
  if (next.length < 8 || !hasLetter || !hasNumber) {
    return res
      .status(422)
      .json({ success: false, error: 'New password must be at least 8 characters and include a letter and number' });
  }

  updateUserPassword(userId, next);
  return res.json({ success: true, message: 'Password changed successfully' });
});

export default router;
