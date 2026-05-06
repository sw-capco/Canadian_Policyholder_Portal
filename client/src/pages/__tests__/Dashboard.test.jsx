import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard.jsx';

vi.mock('../../utils/api.js', () => ({
  api: {
    get: vi.fn(),
  },
}));

vi.mock('../../utils/auth.js', () => ({
  getAuthUser: vi.fn(),
}));

import { api } from '../../utils/api.js';
import { getAuthUser } from '../../utils/auth.js';

describe('Dashboard', () => {
  it('renders policy card after fetch', async () => {
    getAuthUser.mockReturnValue({ policyNumber: 'POL123456' });
    api.get.mockResolvedValueOnce({
      data: {
        policyNumber: 'POL123456',
        coverageType: 'Comprehensive',
        coverageLimit: 1000000,
        deductible: 500,
      },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Policy POL123456/i)).toBeInTheDocument();
      expect(screen.getByText(/Comprehensive/i)).toBeInTheDocument();
    });
  });

  it('renders multiple policy cards for multi-policy user', async () => {
    getAuthUser.mockReturnValue({ policyNumbers: ['POL123456', 'POL999999'] });
    api.get
      .mockResolvedValueOnce({
        data: {
          policyNumber: 'POL123456',
          coverageType: 'Comprehensive',
          coverageLimit: 1000000,
          deductible: 500,
        },
      })
      .mockResolvedValueOnce({
        data: {
          policyNumber: 'POL999999',
          coverageType: 'Third Party Liability',
          coverageLimit: 2000000,
          deductible: 1000,
        },
      });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Policy POL123456/i)).toBeInTheDocument();
      expect(screen.getByText(/Policy POL999999/i)).toBeInTheDocument();
    });
  });
});
