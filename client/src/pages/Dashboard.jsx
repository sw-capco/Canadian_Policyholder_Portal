import React, { useEffect, useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import { Link, useNavigate } from 'react-router-dom';
import PolicyCard from '../components/PolicyCard.jsx';
import { api } from '../utils/api.js';
import { clearAuth, getAuthUser } from '../utils/auth.js';

function usePolicyNumber() {
  const user = getAuthUser();
  return user?.policyNumber || 'POL123456';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const policyNumber = usePolicyNumber();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [policy, setPolicy] = useState(null);

  const policies = useMemo(() => (policy ? [policy] : []), [policy]);

  async function fetchPolicy() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/policies/${encodeURIComponent(policyNumber)}`);
      setPolicy(res.data);
    } catch (err) {
      const message = err?.response?.data?.error || 'Unable to load policy details.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPolicy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyNumber]);

  async function handleDownloadProof(p) {
    const res = await api.get(`/api/policies/${encodeURIComponent(p.policyNumber)}/proof`, {
      responseType: 'blob',
    });
    saveAs(res.data, `proof-of-insurance-${p.policyNumber}.pdf`);
  }

  function handleSignOut() {
    clearAuth();
    navigate('/signin', { replace: true });
  }

  return (
    <div className="page" style={{ placeItems: 'start center' }}>
      <div className="dashboard">
        <div className="dashHeader">
          <div>
            <h1 style={{ margin: 0 }}>Dashboard</h1>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Your policy summary and quick actions</div>
          </div>
          <div className="actions" style={{ margin: 0 }}>
            <Link className="btn btnSecondary" to="/profile">
              My Profile
            </Link>
            <button type="button" className="btn btnSecondary" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>

        <div className="srOnly" aria-live="polite">
          {loading ? 'Loading policy details' : ''}
        </div>

        {loading ? (
          <div role="status" aria-live="polite">
            Loading…
          </div>
        ) : null}

        {error ? (
          <div role="alert" aria-live="polite" style={{ marginTop: 12 }}>
            <div className="error">{error}</div>
            <button type="button" className="btn btnSecondary" style={{ marginTop: 8 }} onClick={fetchPolicy}>
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="grid" style={{ marginTop: 16 }}>
            {policies.map((p) => (
              <PolicyCard key={p.policyNumber} policy={p} onDownloadProof={handleDownloadProof} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
