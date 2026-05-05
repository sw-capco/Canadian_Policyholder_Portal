export function isValidCanadianPhone(value) {
  const v = String(value || '').trim();
  return /^(\+1)?[ .-]?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}$/.test(v);
}

export function isValidDriversLicense(value) {
  const v = String(value || '').trim();
  return /^[A-Za-z0-9-]{8,20}$/.test(v);
}

export function validateNewPassword(value) {
  const v = String(value || '');
  const hasLetter = /[A-Za-z]/.test(v);
  const hasNumber = /\d/.test(v);
  if (v.length < 8) return 'Password must be at least 8 characters.';
  if (!hasLetter || !hasNumber) return 'Password must include a letter and a number.';
  return '';
}

