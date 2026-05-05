import { describe, expect, it } from 'vitest';
import app from '../index.js';
import { testRequest } from './testRequest.js';

async function signin(email = 'policyholder@example.com') {
  const res = await testRequest(app, { method: 'POST', url: '/api/auth/signin', body: { email, password: 'password123' } });
  return res.body.token;
}

describe('claims routes', () => {
  it('requires auth', async () => {
    const res = await testRequest(app, { method: 'POST', url: '/api/claims', body: {} });
    expect(res.status).toBe(401);
  });

  it('creates claim with generated claim number', async () => {
    const token = await signin();
    const res = await testRequest(app, {
      method: 'POST',
      url: '/api/claims',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        policyNumber: 'POL123456',
        incidentDate: '2024-12-15',
        incidentLocation: '401 Highway near Toronto',
        incidentDescription: 'Rear-ended at red light, moderate damage to bumper',
      },
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.claimNumber).toMatch(/^CLM-20241215-[A-Z0-9]{5}$/);
  });

  it('rejects short description', async () => {
    const token = await signin();
    const res = await testRequest(app, {
      method: 'POST',
      url: '/api/claims',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        policyNumber: 'POL123456',
        incidentDate: '2024-12-15',
        incidentLocation: 'Toronto',
        incidentDescription: 'Too short',
      },
    });
    expect(res.status).toBe(422);
  });
});
