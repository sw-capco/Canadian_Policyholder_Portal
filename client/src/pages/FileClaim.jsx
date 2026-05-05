import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { getAuthUser } from '../utils/auth.js';

function useDefaultPolicyNumber() {
  const user = getAuthUser();
  return user?.policyNumber || user?.policyNumbers?.[0] || 'POL123456';
}

export default function FileClaim() {
  const defaultPolicyNumber = useDefaultPolicyNumber();
  const [policyNumber, setPolicyNumber] = useState(defaultPolicyNumber);
  const [incidentDate, setIncidentDate] = useState('2024-12-15');
  const [incidentLocation, setIncidentLocation] = useState('401 Highway near Toronto');
  const [incidentDescription, setIncidentDescription] = useState(
    'Rear-ended at red light, moderate damage to bumper',
  );
  const [touched, setTouched] = useState({
    policyNumber: false,
    incidentDate: false,
    incidentLocation: false,
    incidentDescription: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const errors = useMemo(() => {
    const next = {};
    if (touched.policyNumber && !String(policyNumber || '').trim()) next.policyNumber = 'Policy number is required.';
    if (touched.incidentDate && !String(incidentDate || '').trim()) next.incidentDate = 'Incident date is required.';
    if (touched.incidentLocation && !String(incidentLocation || '').trim()) {
      next.incidentLocation = 'Incident location is required.';
    }
    if (touched.incidentDescription && String(incidentDescription || '').trim().length < 20) {
      next.incidentDescription = 'Description must be at least 20 characters.';
    }
    return next;
  }, [incidentDate, incidentDescription, incidentLocation, policyNumber, touched]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setTouched({ policyNumber: true, incidentDate: true, incidentLocation: true, incidentDescription: true });
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const res = await api.post('/api/claims', {
        policyNumber: String(policyNumber).trim(),
        incidentDate,
        incidentLocation: String(incidentLocation).trim(),
        incidentDescription: String(incidentDescription).trim(),
      });
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to submit claim.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page" style={{ placeItems: 'start center' }}>
      <div className="dashboard">
        <div className="dashHeader">
          <div>
            <h1 style={{ margin: 0 }}>File a Claim</h1>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>First Notice of Loss (FNOL)</div>
          </div>
          <Link className="btn btnSecondary" to="/dashboard">
            Back to Dashboard
          </Link>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr', maxWidth: 620 }}>
          <div className="policyCard">
            <h2 style={{ marginTop: 0 }}>Incident details</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label className="label" htmlFor="policyNumber">
                  Policy number
                </label>
                <input
                  id="policyNumber"
                  className="input"
                  value={policyNumber}
                  onBlur={() => setTouched((t) => ({ ...t, policyNumber: true }))}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                />
                {errors.policyNumber ? (
                  <div className="error" role="alert" aria-live="polite">
                    {errors.policyNumber}
                  </div>
                ) : null}
              </div>

              <div className="field">
                <label className="label" htmlFor="incidentDate">
                  Incident date
                </label>
                <input
                  id="incidentDate"
                  className="input"
                  type="date"
                  value={incidentDate}
                  onBlur={() => setTouched((t) => ({ ...t, incidentDate: true }))}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />
                {errors.incidentDate ? (
                  <div className="error" role="alert" aria-live="polite">
                    {errors.incidentDate}
                  </div>
                ) : null}
              </div>

              <div className="field">
                <label className="label" htmlFor="incidentLocation">
                  Location
                </label>
                <input
                  id="incidentLocation"
                  className="input"
                  value={incidentLocation}
                  onBlur={() => setTouched((t) => ({ ...t, incidentLocation: true }))}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                />
                {errors.incidentLocation ? (
                  <div className="error" role="alert" aria-live="polite">
                    {errors.incidentLocation}
                  </div>
                ) : null}
              </div>

              <div className="field">
                <label className="label" htmlFor="incidentDescription">
                  Description
                </label>
                <textarea
                  id="incidentDescription"
                  className="input"
                  rows={4}
                  value={incidentDescription}
                  onBlur={() => setTouched((t) => ({ ...t, incidentDescription: true }))}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                />
                {errors.incidentDescription ? (
                  <div className="error" role="alert" aria-live="polite">
                    {errors.incidentDescription}
                  </div>
                ) : null}
              </div>

              {error ? (
                <div className="error" role="alert" aria-live="polite" style={{ marginBottom: 12 }}>
                  {error}
                </div>
              ) : null}

              <button type="submit" className="btn btnPrimary" disabled={submitting}>
                Submit Claim
              </button>
            </form>
          </div>

          {result?.success ? (
            <div className="policyCard" role="status" aria-live="polite">
              <h2 style={{ marginTop: 0 }}>Submitted</h2>
              <div style={{ fontSize: 14 }}>
                Claim number: <strong>{result.claimNumber}</strong>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>{result.message}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
                Estimated processing time: {result.estimatedProcessingTime}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
