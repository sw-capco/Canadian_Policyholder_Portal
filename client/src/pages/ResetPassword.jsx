import React from 'react';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  return (
    <div className="page">
      <div className="card">
        <h1>Reset Password</h1>
        <p style={{ color: 'var(--muted)' }}>
          Password reset flow is not implemented in this selected scope.
        </p>
        <Link to="/signin">Back to Sign In</Link>
      </div>
    </div>
  );
}

