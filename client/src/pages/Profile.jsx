import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ChangePassword from '../components/ChangePassword.jsx';
import { api } from '../utils/api.js';
import { isValidCanadianPhone, isValidDriversLicense } from '../utils/validation.js';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    driversLicenseNumber: '',
  });
  const [touched, setTouched] = useState({
    fullName: false,
    address: false,
    phoneNumber: false,
    driversLicenseNumber: false,
  });

  const errors = useMemo(() => {
    const next = {};
    if (touched.fullName && !String(form.fullName).trim()) next.fullName = 'Full name is required.';
    if (touched.address && !String(form.address).trim()) next.address = 'Address is required.';
    if (touched.phoneNumber && !isValidCanadianPhone(form.phoneNumber)) next.phoneNumber = 'Enter a valid phone number.';
    if (touched.driversLicenseNumber && !isValidDriversLicense(form.driversLicenseNumber)) {
      next.driversLicenseNumber = 'Enter a valid driver’s license number.';
    }
    return next;
  }, [form, touched]);

  async function fetchProfile() {
    setLoading(true);
    setLoadError('');
    try {
      const res = await api.get('/api/users/profile');
      setForm({
        fullName: res.data?.fullName || '',
        address: res.data?.address || '',
        phoneNumber: res.data?.phoneNumber || '',
        driversLicenseNumber: res.data?.driversLicenseNumber || '',
      });
    } catch (err) {
      setLoadError(err?.response?.data?.error || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaveError('');
    setSaveMessage('');
    setTouched({ fullName: true, address: true, phoneNumber: true, driversLicenseNumber: true });
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      const res = await api.put('/api/users/profile', {
        fullName: form.fullName,
        address: form.address,
        phoneNumber: form.phoneNumber,
        driversLicenseNumber: form.driversLicenseNumber,
      });
      if (res.data?.success) setSaveMessage(res.data?.message || 'Profile updated successfully.');
    } catch (err) {
      setSaveError(err?.response?.data?.error || 'Unable to save changes.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page" style={{ placeItems: 'start center' }}>
      <div className="dashboard">
        <div className="dashHeader">
          <div>
            <h1 style={{ margin: 0 }}>My Profile</h1>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Update your contact and account information</div>
          </div>
          <Link className="btn btnSecondary" to="/dashboard">
            Back to Dashboard
          </Link>
        </div>

        {loading ? <div role="status">Loading…</div> : null}
        {loadError ? (
          <div role="alert" aria-live="polite">
            <div className="error">{loadError}</div>
            <button type="button" className="btn btnSecondary" style={{ marginTop: 8 }} onClick={fetchProfile}>
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !loadError ? (
          <div className="grid" style={{ gridTemplateColumns: '1fr', maxWidth: 620 }}>
            <div className="policyCard">
              <h2 style={{ marginTop: 0 }}>Contact information</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label className="label" htmlFor="fullName">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    className="input"
                    value={form.fullName}
                    onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                    onChange={(e) => setField('fullName', e.target.value)}
                  />
                  {errors.fullName ? (
                    <div className="error" role="alert" aria-live="polite">
                      {errors.fullName}
                    </div>
                  ) : null}
                </div>

                <div className="field">
                  <label className="label" htmlFor="address">
                    Address
                  </label>
                  <input
                    id="address"
                    className="input"
                    value={form.address}
                    onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                    onChange={(e) => setField('address', e.target.value)}
                  />
                  {errors.address ? (
                    <div className="error" role="alert" aria-live="polite">
                      {errors.address}
                    </div>
                  ) : null}
                </div>

                <div className="field">
                  <label className="label" htmlFor="phoneNumber">
                    Phone number
                  </label>
                  <input
                    id="phoneNumber"
                    className="input"
                    value={form.phoneNumber}
                    inputMode="tel"
                    onBlur={() => setTouched((t) => ({ ...t, phoneNumber: true }))}
                    onChange={(e) => setField('phoneNumber', e.target.value)}
                  />
                  {errors.phoneNumber ? (
                    <div className="error" role="alert" aria-live="polite">
                      {errors.phoneNumber}
                    </div>
                  ) : null}
                </div>

                <div className="field">
                  <label className="label" htmlFor="driversLicenseNumber">
                    Driver’s license number
                  </label>
                  <input
                    id="driversLicenseNumber"
                    className="input"
                    value={form.driversLicenseNumber}
                    onBlur={() => setTouched((t) => ({ ...t, driversLicenseNumber: true }))}
                    onChange={(e) => setField('driversLicenseNumber', e.target.value)}
                  />
                  {errors.driversLicenseNumber ? (
                    <div className="error" role="alert" aria-live="polite">
                      {errors.driversLicenseNumber}
                    </div>
                  ) : null}
                </div>

                {saveError ? (
                  <div className="error" role="alert" aria-live="polite" style={{ marginBottom: 12 }}>
                    {saveError}
                  </div>
                ) : null}
                {saveMessage ? (
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 12 }} role="status" aria-live="polite">
                    {saveMessage}
                  </div>
                ) : null}

                <button type="submit" className="btn btnPrimary" disabled={saving}>
                  Save Changes
                </button>
              </form>
            </div>

            <div className="policyCard">
              <h2 style={{ marginTop: 0 }}>Security</h2>
              <ChangePassword />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

