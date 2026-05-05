import crypto from 'node:crypto';

function formatDateYYYYMMDD(date) {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function randomSuffix(length = 5) {
  // A-Z0-9 only
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i += 1) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

export function generateClaimNumber(incidentDate) {
  const raw = String(incidentDate || '');
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const datePart = match ? `${match[1]}${match[2]}${match[3]}` : formatDateYYYYMMDD(new Date(raw));
  return `CLM-${datePart}-${randomSuffix(5)}`;
}
