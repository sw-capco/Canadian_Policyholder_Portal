import express from 'express';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/:policyNumber', requireAuth, (req, res) => {
  const { policyNumber } = req.params;
  return res.json({
    policyNumber,
    coverageType: 'Comprehensive',
    coverageLimit: 1000000,
    deductible: 500,
    effectiveDate: '2024-01-01',
    expiryDate: '2025-01-01',
  });
});

router.get('/:policyNumber/proof', requireAuth, (req, res) => {
  const { policyNumber } = req.params;
  const pdfBytes = Buffer.from(
    `%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n`,
    'utf8',
  );
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="proof-of-insurance-${policyNumber}.pdf"`);
  res.send(pdfBytes);
});

export default router;

