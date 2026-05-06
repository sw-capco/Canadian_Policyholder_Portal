import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { findUserById, updateUserProfile } from '../mock/data.js';

const router = express.Router();

function isValidCanadianPhone(value) {
  // Accept E.164 +1XXXXXXXXXX or common punctuation formats.
  const v = String(value || '').trim();
  return /^(\+1)?[ .-]?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}$/.test(v);
}

function isValidDriversLicense(value) {
  const v = String(value || '').trim();
  // Dependency-free demo validation for common provincial patterns.
  // Ontario: A1234-56789-12345 (1 letter + 14 digits; dashes optional)
  // Quebec: TREM12345678 (4 letters + 8 digits)
  // British Columbia: 7 digits
  const on = /^[A-Za-z]\d{4}[- ]?\d{5}[- ]?\d{5}$/.test(v);
  const qc = /^[A-Za-z]{4}\d{8}$/.test(v);
  const bc = /^\d{7}$/.test(v);
  return on || qc || bc;
}

router.get('/profile', requireAuth, (req, res) => {
  const user = findUserById(req.user?.sub);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  return res.json({
    fullName: user.fullName,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    phoneNumber: user.phoneNumber,
    driversLicenseNumber: user.driversLicenseNumber,
  });
});

router.put('/profile', requireAuth, (req, res) => {
  const patch = req.body || {};
  if (Object.prototype.hasOwnProperty.call(patch, 'fullName') && !String(patch.fullName || '').trim()) {
    return res.status(422).json({ success: false, error: 'fullName is required' });
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'address') && !String(patch.address || '').trim()) {
    return res.status(422).json({ success: false, error: 'address is required' });
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'phoneNumber') && !isValidCanadianPhone(patch.phoneNumber)) {
    return res.status(422).json({ success: false, error: 'phoneNumber is invalid' });
  }
  if (
    Object.prototype.hasOwnProperty.call(patch, 'driversLicenseNumber') &&
    !isValidDriversLicense(patch.driversLicenseNumber)
  ) {
    return res.status(422).json({ success: false, error: 'driversLicenseNumber is invalid' });
  }

  const updated = updateUserProfile(req.user?.sub, patch);
  if (!updated) return res.status(404).json({ success: false, error: 'User not found' });
  return res.json({ success: true, message: 'Profile updated successfully' });
});

export default router;
