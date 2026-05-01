import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('policies routes', () => {
  it('requires auth', async () => {
    const res = await request(app).get('/api/policies/POL123456');
    expect(res.status).toBe(401);
  });

  it('returns policy when authed', async () => {
    const signin = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'policyholder@example.com', password: 'password123' });
    const token = signin.body.token;
    const res = await request(app).get('/api/policies/POL123456').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.policyNumber).toBe('POL123456');
  });
});

