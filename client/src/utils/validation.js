export function isValidCanadianPhone(value) {
  const v = String(value || '').trim();
  // Accept E.164 (+1XXXXXXXXXX) or common North American punctuation formats.
  // Kept dependency-free; callers treat any valid NANP number as acceptable for Canada.
  return /^(\+1)?[ .-]?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}$/.test(v);
}

export function isValidDriversLicense(value) {
  const v = String(value || '').trim();
  // Dependency-free demo validation for common provincial patterns.
  // Ontario: A1234-56789-12345 (1 letter + 14 digits; dashes optional)
  // Quebec: TREM12345678 (4 letters + 8 digits)
  // British Columbia: 7 digits
  const on = /^[A-Za-z]\d{4}[- ]?\d{5}[- ]?\d{5}$/.test(v);
  const qc = /^[A-Za-z]{4}\d{8}$/.test(v);
  const bc = /^\d{7}$/.test(v);
  return on || qc || bc;
}

export function validateNewPassword(value) {
  const v = String(value || '');
  const hasLetter = /[A-Za-z]/.test(v);
  const hasNumber = /\d/.test(v);
  if (v.length < 8) return 'Password must be at least 8 characters.';
  if (!hasLetter || !hasNumber) return 'Password must include a letter and a number.';
  return '';
}
