import React from 'react';
import { Link } from 'react-router-dom';

export default function FileClaim() {
  return (
    <div className="page">
      <div className="card">
        <h1>File a Claim</h1>
        <p style={{ color: 'var(--muted)' }}>FNOL flow is not implemented in this selected scope.</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
}

