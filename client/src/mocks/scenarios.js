export const scenarios = {
  auth: {
    standardUser: { email: 'policyholder@example.com', password: 'password123' },
    mfaUser: { email: 'mfa@example.com', password: 'password123', mfaCode: '123456' },
    multiPolicyUser: { email: 'multi@example.com', password: 'password123' },
    expiredPolicyUser: { email: 'expired@example.com', password: 'password123' },
    testerUser: { email: 'jordan.tester@example.com', password: 'password123' },
    ottawaUser: { email: 'sasha.policy@example.com', password: 'password123' },
    quebecUser: { email: 'quebec.user@example.com', password: 'password123' },
    demoUser: { email: 'demo.user@example.com', password: 'password123' },
  },
  policies: {
    owned: 'POL123456',
    secondOwned: 'POL999999',
    expired: 'POLEXPIRED',
    notOwned: 'POL-NOT-OWNED',
  },
  claims: {
    valid: {
      policyNumber: 'POL123456',
      incidentDate: '2024-12-15',
      incidentLocation: '401 Highway near Toronto',
      incidentDescription: 'Rear-ended at red light, moderate damage to bumper',
    },
    shortDescription: {
      policyNumber: 'POL123456',
      incidentDate: '2024-12-15',
      incidentLocation: 'Toronto',
      incidentDescription: 'Too short',
    },
    futureDate: {
      policyNumber: 'POL123456',
      incidentDate: '2099-01-01',
      incidentLocation: 'Toronto',
      incidentDescription: 'Incident date in the future should be rejected by backend validation.',
    },
  },
  profile: {
    validUpdate: { phoneNumber: '+1-416-555-0200', address: '456 Oak St, Toronto ON' },
    invalidPhone: { phoneNumber: 'not-a-phone' },
  },
};
