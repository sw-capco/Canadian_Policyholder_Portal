import { findPolicy } from '../mock/data.js';
import { createClaim } from '../services/claimService.js';
import { generateClaimNumber } from '../utils/claimNumberGenerator.js';

function parseISODate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function toISODateOnly(d) {
  return d.toISOString().slice(0, 10);
}

function isOnOrAfter(a, b) {
  return a.getTime() >= b.getTime();
}

function isOnOrBefore(a, b) {
  return a.getTime() <= b.getTime();
}

export function submitClaim(req, res) {
  const userId = req.user?.sub;
  const { policyNumber, incidentDate, incidentLocation, incidentDescription } = req.body || {};

  if (!policyNumber) return res.status(422).json({ success: false, error: 'policyNumber is required' });
  if (!incidentDate) return res.status(422).json({ success: false, error: 'incidentDate is required' });
  if (!incidentLocation || !String(incidentLocation).trim()) {
    return res.status(422).json({ success: false, error: 'incidentLocation is required' });
  }
  if (!incidentDescription || String(incidentDescription).trim().length < 20) {
    return res.status(422).json({ success: false, error: 'incidentDescription must be at least 20 characters' });
  }

  const policy = findPolicy(String(policyNumber));
  if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });

  const incident = parseISODate(incidentDate);
  if (!incident) return res.status(422).json({ success: false, error: 'incidentDate must be a valid date' });

  const today = new Date();
  const incidentDay = parseISODate(toISODateOnly(incident));
  const todayDay = parseISODate(toISODateOnly(today));

  if (!incidentDay || !todayDay) return res.status(422).json({ success: false, error: 'Invalid date values' });
  if (!isOnOrBefore(incidentDay, todayDay)) {
    return res.status(400).json({ success: false, error: 'incidentDate must be in the past' });
  }

  const effective = parseISODate(policy.effectiveDate);
  const expiry = parseISODate(policy.expiryDate);
  if (!effective || !expiry) return res.status(500).json({ success: false, error: 'Policy dates are invalid' });
  if (!isOnOrAfter(incidentDay, effective)) {
    return res.status(400).json({ success: false, error: 'incidentDate must be on or after policy effectiveDate' });
  }
  if (!isOnOrBefore(incidentDay, expiry)) {
    return res.status(400).json({ success: false, error: 'incidentDate must be on or before policy expiryDate' });
  }

  const claimNumber = generateClaimNumber(toISODateOnly(incidentDay));
  const claim = createClaim({
    userId,
    policyNumber: String(policyNumber),
    incidentDate: toISODateOnly(incidentDay),
    incidentLocation: String(incidentLocation).trim(),
    incidentDescription: String(incidentDescription).trim(),
    claimNumber,
  });

  return res.json({
    success: true,
    claimNumber: claim.claimNumber,
    message: 'Claim submitted successfully',
    estimatedProcessingTime: '2-3 business days',
  });
}
