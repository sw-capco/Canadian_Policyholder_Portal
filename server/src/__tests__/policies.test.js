import { describe, expect, it } from 'vitest';
import app from '../index.js';
import { testRequest } from './testRequest.js';

describe('policies routes', () => {
  async function signIn(email = 'policyholder@example.com', password = 'password123') {
    const signin = await testRequest(app, {
      method: 'POST',
      url: '/api/auth/signin',
      body: { email, password },
    });
    return signin.body.token;
  }

  it('requires auth', async () => {
    const res = await testRequest(app, { method: 'GET', url: '/api/policies/POL123456' });
    expect(res.status).toBe(401);
  });

  it('returns policy when authed', async () => {
    const token = await signIn();
    const res = await testRequest(app, {
      method: 'GET',
      url: '/api/policies/POL123456',
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(res.body.policyNumber).toBe('POL123456');
  });

  it('rejects access to policy not owned', async () => {
    const token = await signIn();
    const res = await testRequest(app, {
      method: 'GET',
      url: '/api/policies/POL999999',
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(403);
  });

  it('returns 404 when policy does not exist (but user is authorized)', async () => {
    const token = await signIn('multi@example.com', 'password123');
    const res = await testRequest(app, {
      method: 'GET',
      url: '/api/policies/POLMISSING',
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(404);
  });

  it('downloads proof-of-insurance PDF', async () => {
    const token = await signIn();
    const res = await testRequest(app, {
      method: 'GET',
      url: '/api/policies/POL123456/proof',
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const contentType = String(res.headers['content-type'] || res.headers['Content-Type'] || '');
    const disposition = String(res.headers['content-disposition'] || res.headers['Content-Disposition'] || '');
    expect(contentType).toContain('application/pdf');
    expect(disposition).toContain('attachment');
    expect(res.rawBody.startsWith('%PDF-')).toBe(true);
    expect(res.rawBody).toContain('POL123456');
    expect(res.rawBody).toContain('PROOF OF INSURANCE');
  });
});
