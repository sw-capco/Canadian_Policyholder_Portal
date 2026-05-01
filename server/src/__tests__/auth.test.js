import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('auth routes', () => {
  it('rejects invalid credentials', async () => {
    const res = await request(app).post('/api/auth/signin').send({ email: 'x@y.com', password: 'password123' });
    expect(res.status).toBe(401);
  });

  it('signs in and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'policyholder@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
  });
});

