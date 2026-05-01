import { verifyToken } from '../lib/jwt.js';

export default function requireAuth(req, res, next) {
  const header = req.header('Authorization') || '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).json({ success: false, error: 'Missing token' });
  try {
    const decoded = verifyToken(match[1]);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

