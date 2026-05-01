import React, { useEffect, useRef, useState } from 'react';
import { api } from '../utils/api.js';

export default function MFAPrompt({ mfaToken, onVerified, onCancel }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!/^[0-9]{6}$/.test(code)) {
      setError('Enter a 6-digit code.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/api/auth/verify-mfa', { mfaToken, code });
      onVerified(res.data);
    } catch (err) {
      const message = err?.response?.data?.error || 'Unable to verify code.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="mfaTitle">
      <div className="modal">
        <h2 id="mfaTitle" style={{ marginTop: 0 }}>
          Multi-factor authentication
        </h2>
        <p style={{ color: 'var(--muted)', marginTop: 0 }}>
          Enter the 6-digit code from your authenticator app.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="mfaCode">
              Code
            </label>
            <input
              id="mfaCode"
              ref={inputRef}
              className="input"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              aria-label="MFA code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {error ? (
              <div className="error" role="alert" aria-live="polite">
                {error}
              </div>
            ) : null}
          </div>
          <div className="row">
            <button type="button" className="btn btnSecondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btnPrimary" disabled={submitting}>
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

