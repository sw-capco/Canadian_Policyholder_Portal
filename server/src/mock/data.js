const USERS = [
  {
    id: 'u1',
    email: 'policyholder@example.com',
    password: 'password123',
    fullName: 'Alex Policyholder',
    dateOfBirth: '1980-05-15',
    address: '123 Maple St, Toronto ON',
    phoneNumber: '+1-416-555-0100',
    driversLicenseNumber: 'D1234-56789-12345',
    policyNumbers: ['POL123456'],
    mfaEnabled: false,
  },
  {
    id: 'u2',
    email: 'mfa@example.com',
    password: 'password123',
    fullName: 'Morgan MFA',
    dateOfBirth: '1990-10-02',
    address: '456 Oak St, Ottawa ON',
    phoneNumber: '+1-613-555-0133',
    driversLicenseNumber: 'D2234-56789-12345',
    policyNumbers: ['POL123456'],
    mfaEnabled: true,
  },
  {
    id: 'u3',
    email: 'multi@example.com',
    password: 'password123',
    fullName: 'Casey Multi Policy',
    dateOfBirth: '1975-03-28',
    address: '789 Pine Ave, Mississauga ON',
    phoneNumber: '+1-905-555-0199',
    driversLicenseNumber: 'D3234-56789-12345',
    policyNumbers: ['POL123456', 'POL999999'],
    mfaEnabled: false,
  },
  {
    id: 'u4',
    email: 'expired@example.com',
    password: 'password123',
    fullName: 'Evan Expired',
    dateOfBirth: '1988-08-08',
    address: '12 Cedar Rd, Hamilton ON',
    phoneNumber: '+1-289-555-0123',
    driversLicenseNumber: 'D4234-56789-12345',
    policyNumbers: ['POLEXPIRED'],
    mfaEnabled: false,
  },
  {
    id: 'u5',
    email: 'jordan.tester@example.com',
    password: 'password123',
    fullName: 'Jordan Tester',
    dateOfBirth: '1992-11-21',
    address: '77 King St W, Toronto ON',
    phoneNumber: '+1-416-555-0142',
    driversLicenseNumber: 'D5234-56789-12345',
    policyNumbers: ['POL123456'],
    mfaEnabled: false,
  },
  {
    id: 'u6',
    email: 'sasha.policy@example.com',
    password: 'password123',
    fullName: 'Sasha Policy',
    dateOfBirth: '1984-01-09',
    address: '101 Rideau St, Ottawa ON',
    phoneNumber: '+1-613-555-0177',
    driversLicenseNumber: 'D6234-56789-12345',
    policyNumbers: ['POL999999'],
    mfaEnabled: false,
  },
  {
    id: 'u7',
    email: 'quebec.user@example.com',
    password: 'password123',
    fullName: 'Camille Québec',
    dateOfBirth: '1979-07-03',
    address: '250 Rue Sainte-Catherine O, Montréal QC',
    phoneNumber: '+1-514-555-0118',
    driversLicenseNumber: 'D7234-56789-12345',
    policyNumbers: ['POL123456'],
    mfaEnabled: false,
  },
  {
    id: 'u8',
    email: 'demo.user@example.com',
    password: 'password123',
    fullName: 'Demo User',
    dateOfBirth: '1996-04-14',
    address: '5 Robson St, Vancouver BC',
    phoneNumber: '+1-604-555-0164',
    driversLicenseNumber: 'D8234-56789-12345',
    policyNumbers: ['POL123456', 'POL999999'],
    mfaEnabled: false,
  },
];

const POLICIES = [
  {
    policyNumber: 'POL123456',
    coverageType: 'Comprehensive',
    coverageLimit: 1000000,
    deductible: 500,
    effectiveDate: '2024-01-01',
    expiryDate: '2025-01-01',
    vehicles: [{ make: 'Toyota', model: 'Camry', year: 2022, vin: '1HGCM82633A123456' }],
  },
  {
    policyNumber: 'POL999999',
    coverageType: 'Third Party Liability',
    coverageLimit: 2000000,
    deductible: 1000,
    effectiveDate: '2024-06-01',
    expiryDate: '2025-06-01',
    vehicles: [{ make: 'Honda', model: 'Civic', year: 2021, vin: '2HGCM82633A123456' }],
  },
  {
    policyNumber: 'POLEXPIRED',
    coverageType: 'Comprehensive',
    coverageLimit: 1000000,
    deductible: 500,
    effectiveDate: '2023-01-01',
    expiryDate: '2024-01-01',
    vehicles: [{ make: 'Subaru', model: 'Outback', year: 2020, vin: '3HGCM82633A123456' }],
  },
];

export function findUserByEmail(email) {
  const normalized = String(email || '').toLowerCase();
  return USERS.find((u) => u.email.toLowerCase() === normalized);
}

export function findUserById(id) {
  return USERS.find((u) => u.id === id);
}

export function updateUserPassword(userId, nextPassword) {
  const user = findUserById(userId);
  if (!user) return null;
  user.password = nextPassword;
  return user;
}

export function updateUserProfile(userId, patch) {
  const user = findUserById(userId);
  if (!user) return null;
  const allowed = ['address', 'phoneNumber', 'driversLicenseNumber', 'fullName'];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) user[key] = patch[key];
  }
  return user;
}

export function listUserPolicyNumbers(userId) {
  const user = findUserById(userId);
  return user?.policyNumbers ?? [];
}

export function findPolicy(policyNumber) {
  return POLICIES.find((p) => p.policyNumber === policyNumber);
}

export function toSafeUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    policyNumber: user.policyNumbers?.[0],
    policyNumbers: user.policyNumbers,
  };
}
