import { describe, expect, it } from 'vitest';
import app from '../index.js';
import { testRequest } from './testRequest.js';

describe('policies routes', () => {
  it('requires auth', async () => {
    const res = await testRequest(app, { method: 'GET', url: '/api/policies/POL123456' });
    expect(res.status).toBe(401);
  });

  it('returns policy when authed', async () => {
    const signin = await testRequest(app, {
      method: 'POST',
      url: '/api/auth/signin',
      body: { email: 'policyholder@example.com', password: 'password123' },
    });
    const token = signin.body.token;
    const res = await testRequest(app, {
      method: 'GET',
      url: '/api/policies/POL123456',
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(res.body.policyNumber).toBe('POL123456');
  });

  it('rejects access to policy not owned', async () => {
    const signin = await testRequest(app, {
      method: 'POST',
      url: '/api/auth/signin',
      body: { email: 'policyholder@example.com', password: 'password123' },
    });
    const token = signin.body.token;
    const res = await testRequest(app, {
      method: 'GET',
      url: '/api/policies/POL999999',
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(403);
  });
});
