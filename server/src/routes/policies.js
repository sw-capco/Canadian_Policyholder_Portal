import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { findPolicy, listUserPolicyNumbers } from '../mock/data.js';
import { generateProofPdf } from '../services/pdfGenerator.js';

const router = express.Router();

router.get('/:policyNumber', requireAuth, (req, res) => {
  const { policyNumber } = req.params;
  const userPolicies = listUserPolicyNumbers(req.user?.sub);
  if (!userPolicies.includes(policyNumber)) {
    return res.status(403).json({ success: false, error: 'Not authorized to access this policy' });
  }

  const policy = findPolicy(policyNumber);
  if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });
  return res.json(policy);
});

router.get('/:policyNumber/proof', requireAuth, (req, res) => {
  const { policyNumber } = req.params;
  const userPolicies = listUserPolicyNumbers(req.user?.sub);
  if (!userPolicies.includes(policyNumber)) {
    return res.status(403).json({ success: false, error: 'Not authorized to access this policy' });
  }

  const policy = findPolicy(policyNumber);
  if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });

  const pdfBytes = generateProofPdf(policy);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="proof-of-insurance-${policyNumber}.pdf"`);
  res.send(pdfBytes);
});

export default router;
