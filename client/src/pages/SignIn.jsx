import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MFAPrompt from '../components/MFAPrompt.jsx';
import { api } from '../utils/api.js';
import { setAuthToken, setAuthUser } from '../utils/auth.js';

function isValidEmail(email) {
  const value = String(email || '').trim();
  // Keep validation intentionally simple: allow most RFC-ish emails and reject obvious typos/whitespace.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [mfaState, setMfaState] = useState(null); // { mfaToken, user }

  const errors = useMemo(() => {
    const next = {};
    if (touched.email && !isValidEmail(email)) next.email = 'Enter a valid email address.';
    if (touched.password && password.length < 8) next.password = 'Password must be at least 8 characters.';
    return next;
  }, [email, password, touched]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setTouched({ email: true, password: true });
    const normalizedEmail = String(email || '').trim();
    if (!isValidEmail(normalizedEmail) || password.length < 8) return;

    setSubmitting(true);
    try {
      const res = await api.post('/api/auth/signin', { email: normalizedEmail, password });
      if (res.data?.mfa_required) {
        setMfaState({ mfaToken: res.data.mfa_token, user: res.data.user });
        return;
      }
      setAuthToken(res.data.token);
      setAuthUser(res.data.user);
      const dest = location.state?.from || '/dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.error || 'Unable to sign in.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleMfaVerified(payload) {
    setAuthToken(payload.token);
    setAuthUser(payload.user);
    const dest = location.state?.from || '/dashboard';
    navigate(dest, { replace: true });
  }

  function handleCancelMfa() {
    setMfaState(null);
  }

  return (
    <div className="page">
      <div className="card" aria-label="Sign in">
        <h1>Secure Sign In</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              aria-label="Email"
              value={email}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email ? (
              <div className="error" role="alert" aria-live="polite">
                {errors.email}
              </div>
            ) : null}
          </div>

          <div className="field">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              aria-label="Password"
              value={password}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password ? (
              <div className="error" role="alert" aria-live="polite">
                {errors.password}
              </div>
            ) : null}
          </div>

          {formError ? (
            <div className="error" role="alert" aria-live="polite" style={{ marginBottom: 12 }}>
              {formError}
            </div>
          ) : null}

          <button type="submit" className="btn btnPrimary" disabled={submitting} style={{ width: '100%' }}>
            Sign In
          </button>

          <div className="row" style={{ marginTop: 12 }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>Need help?</span>
            <Link to="/reset-password">Forgot Password</Link>
          </div>
        </form>
      </div>

      {mfaState ? (
        <MFAPrompt
          mfaToken={mfaState.mfaToken}
          onVerified={handleMfaVerified}
          onCancel={handleCancelMfa}
        />
      ) : null}
    </div>
  );
}
