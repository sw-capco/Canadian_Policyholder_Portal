import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

let ephemeralDevSecret;

function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (!ephemeralDevSecret) ephemeralDevSecret = crypto.randomBytes(32).toString('hex');
  return ephemeralDevSecret;
}

export function signToken(payload, { expiresIn = '1h' } = {}) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}
