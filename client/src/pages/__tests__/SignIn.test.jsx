import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../SignIn.jsx';

vi.mock('../../utils/api.js', () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ state: null }),
  };
});

import { api } from '../../utils/api.js';

describe('SignIn', () => {
  it('validates email and password', async () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
    );

    fireEvent.blur(screen.getByLabelText('Email'));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } });
    fireEvent.blur(screen.getByLabelText('Password'));
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } });

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      expect(screen.getByText(/at least 8/i)).toBeInTheDocument();
    });
  });

  it('calls signin endpoint on submit', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 't', mfa_required: false, user: { id: '1' } } });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/signin', {
        email: 'a@b.com',
        password: 'password123',
      });
    });
  });
});

