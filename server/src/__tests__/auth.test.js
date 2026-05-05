import { describe, expect, it } from 'vitest';
import app from '../index.js';
import { testRequest } from './testRequest.js';

describe('auth routes', () => {
  it('rejects invalid credentials', async () => {
    const res = await testRequest(app, {
      method: 'POST',
      url: '/api/auth/signin',
      body: { email: 'x@y.com', password: 'password123' },
    });
    expect(res.status).toBe(401);
  });

  it('signs in and returns token', async () => {
    const res = await testRequest(app, {
      method: 'POST',
      url: '/api/auth/signin',
      body: { email: 'policyholder@example.com', password: 'password123' },
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
  });

  it('changes password for authed user', async () => {
    const signin = await testRequest(app, {
      method: 'POST',
      url: '/api/auth/signin',
      body: { email: 'policyholder@example.com', password: 'password123' },
    });
    const token = signin.body.token;

    const res = await testRequest(app, {
      method: 'POST',
      url: '/api/auth/change-password',
      headers: { Authorization: `Bearer ${token}` },
      body: { currentPassword: 'password123', newPassword: 'password456' },
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
