import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FileClaim from '../FileClaim.jsx';

vi.mock('../../utils/api.js', () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock('../../utils/auth.js', () => ({
  getAuthUser: () => ({ policyNumber: 'POL123456' }),
}));

import { api } from '../../utils/api.js';

describe('FileClaim', () => {
  it('submits claim to backend', async () => {
    api.post.mockResolvedValueOnce({ data: { success: true, claimNumber: 'CLM-20241215-A3F9K' } });

    render(
      <MemoryRouter>
        <FileClaim />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /submit claim/i }));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/claims', expect.any(Object));
    });
  });
});

