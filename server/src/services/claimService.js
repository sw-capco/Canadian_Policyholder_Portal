const CLAIMS = [];

export function createClaim({ userId, policyNumber, incidentDate, incidentLocation, incidentDescription, claimNumber }) {
  const claim = {
    id: `c_${CLAIMS.length + 1}`,
    userId,
    policyNumber,
    incidentDate,
    incidentLocation,
    incidentDescription,
    claimNumber,
    createdAt: new Date().toISOString(),
    status: 'submitted',
  };
  CLAIMS.push(claim);
  return claim;
}

export function listClaimsForUser(userId) {
  return CLAIMS.filter((c) => c.userId === userId);
}

