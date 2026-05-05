import { generateProofPdf } from '../services/pdfGenerator.js';
import { getPolicyForUser } from '../services/policyService.js';

export function getPolicy(req, res) {
  const { policyNumber } = req.params;
  const result = getPolicyForUser({ userId: req.user?.sub, policyNumber });

  if (!result.ok) return res.status(result.status).json({ success: false, error: result.error });
  return res.json(result.policy);
}

export function downloadProof(req, res) {
  const { policyNumber } = req.params;
  const result = getPolicyForUser({ userId: req.user?.sub, policyNumber });

  if (!result.ok) return res.status(result.status).json({ success: false, error: result.error });

  const pdfBytes = generateProofPdf(result.policy);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="proof-of-insurance-${policyNumber}.pdf"`);
  return res.send(pdfBytes);
}

