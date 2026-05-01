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
  getAuthUser: () => ({ policyNumber: 'POL123456' }),
}));

import { api } from '../../utils/api.js';

describe('Dashboard', () => {
  it('renders policy card after fetch', async () => {
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
});

