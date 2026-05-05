import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../Profile.jsx';

vi.mock('../../utils/api.js', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

import { api } from '../../utils/api.js';

describe('Profile', () => {
  it('loads and saves profile', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        fullName: 'John Doe',
        address: '123 Maple St, Toronto ON',
        phoneNumber: '+1-416-555-0100',
        driversLicenseNumber: 'D1234-56789-12345',
      },
    });
    api.put.mockResolvedValueOnce({ data: { success: true, message: 'Profile updated successfully' } });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue(/John Doe/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Phone number/i), { target: { value: '+1-416-555-0200' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    });
  });
});

