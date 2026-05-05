import { findPolicy, listUserPolicyNumbers } from '../mock/data.js';

export function getPolicyForUser({ userId, policyNumber }) {
  const userPolicies = listUserPolicyNumbers(userId);
  if (!userPolicies.includes(policyNumber)) {
    return { ok: false, status: 403, error: 'Not authorized to access this policy' };
  }

  const policy = findPolicy(policyNumber);
  if (!policy) return { ok: false, status: 404, error: 'Policy not found' };
  return { ok: true, policy };
}

