import { describe, expect, it } from 'vitest';
import app from '../index.js';
import { testRequest } from './testRequest.js';

async function signin(email = 'policyholder@example.com') {
  const res = await testRequest(app, { method: 'POST', url: '/api/auth/signin', body: { email, password: 'password123' } });
  return res.body.token;
}

describe('users profile routes', () => {
  it('requires auth', async () => {
    const res = await testRequest(app, { method: 'GET', url: '/api/users/profile' });
    expect(res.status).toBe(401);
  });

  it('returns profile for authed user', async () => {
    const token = await signin();
    const res = await testRequest(app, { method: 'GET', url: '/api/users/profile', headers: { Authorization: `Bearer ${token}` } });
    expect(res.status).toBe(200);
    expect(res.body.fullName).toBeTruthy();
  });

  it('updates profile with validation', async () => {
    const token = await signin();
    const res = await testRequest(app, {
      method: 'PUT',
      url: '/api/users/profile',
      headers: { Authorization: `Bearer ${token}` },
      body: { phoneNumber: 'not-a-phone' },
    });
    expect(res.status).toBe(422);
  });
});
