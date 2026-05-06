import React, { useMemo, useState } from 'react';
import { api } from '../utils/api.js';
import { validateNewPassword } from '../utils/validation.js';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [touched, setTouched] = useState({ currentPassword: false, newPassword: false });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const errors = useMemo(() => {
    const next = {};
    if (touched.currentPassword && currentPassword.length < 1) next.currentPassword = 'Enter your current password.';
    if (touched.newPassword) {
      const pwdErr = validateNewPassword(newPassword);
      if (pwdErr) next.newPassword = pwdErr;
    }
    return next;
  }, [currentPassword, newPassword, touched]);

  function errorId(name) {
    return `${name}-error`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    setTouched({ currentPassword: true, newPassword: true });
    if (currentPassword.length < 1) return;
    const pwdErr = validateNewPassword(newPassword);
    if (pwdErr) return;

    setSubmitting(true);
    try {
      const res = await api.post('/api/auth/change-password', { currentPassword, newPassword });
      if (res.data?.success) {
        setCurrentPassword('');
        setNewPassword('');
        setTouched({ currentPassword: false, newPassword: false });
        setMessage(res.data?.message || 'Password changed successfully.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to change password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Change password">
      <div className="field">
        <label className="label" htmlFor="currentPassword">
          Current password
        </label>
        <input
          id="currentPassword"
          className="input"
          type="password"
          autoComplete="current-password"
          aria-label="Current password"
          aria-invalid={Boolean(errors.currentPassword)}
          aria-describedby={errors.currentPassword ? errorId('currentPassword') : undefined}
          value={currentPassword}
          onBlur={() => setTouched((t) => ({ ...t, currentPassword: true }))}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        {errors.currentPassword ? (
          <div id={errorId('currentPassword')} className="error" role="alert" aria-live="polite">
            {errors.currentPassword}
          </div>
        ) : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="newPassword">
          New password
        </label>
        <input
          id="newPassword"
          className="input"
          type="password"
          autoComplete="new-password"
          aria-label="New password"
          aria-invalid={Boolean(errors.newPassword)}
          aria-describedby={errors.newPassword ? errorId('newPassword') : undefined}
          value={newPassword}
          onBlur={() => setTouched((t) => ({ ...t, newPassword: true }))}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {errors.newPassword ? (
          <div id={errorId('newPassword')} className="error" role="alert" aria-live="polite">
            {errors.newPassword}
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="error" role="alert" aria-live="polite" style={{ marginBottom: 12 }}>
          {error}
        </div>
      ) : null}
      {message ? (
        <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 12 }} role="status" aria-live="polite">
          {message}
        </div>
      ) : null}

      <button type="submit" className="btn btnSecondary" disabled={submitting}>
        Change Password
      </button>
    </form>
  );
}
