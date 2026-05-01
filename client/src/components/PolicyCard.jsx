import React from 'react';
import { Link } from 'react-router-dom';

function formatCurrency(value) {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
}

export default function PolicyCard({ policy, onDownloadProof }) {
  return (
    <div className="policyCard" aria-label={`Policy ${policy.policyNumber}`}>
      <h2>Policy {policy.policyNumber}</h2>
      <div className="kv">
        <div className="k">Coverage type</div>
        <div>{policy.coverageType}</div>

        <div className="k">Coverage limit</div>
        <div>{formatCurrency(policy.coverageLimit)}</div>

        <div className="k">Deductible</div>
        <div>{formatCurrency(policy.deductible)}</div>
      </div>
      <div className="actions">
        <Link className="btn btnPrimary" to="/file-claim">
          File a Claim
        </Link>
        <button type="button" className="btn btnSecondary" onClick={() => onDownloadProof(policy)}>
          Download Proof
        </button>
      </div>
    </div>
  );
}
