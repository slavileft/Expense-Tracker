const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- Auth ----------

export function validateEmail(value) {
  if (!value.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address';
  return '';
}

export function validateRequiredPassword(value) {
  if (!value) return 'Password is required';
  return '';
}

export function validateNewPassword(value) {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'Password must be at least 6 characters';
  return '';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
}

// ---------- Expense ----------

export function validateTitle(value) {
  const text = value.trim();
  if (!text) return 'Title is required';
  if (text.length < 2) return 'Title must be at least 2 characters';
  if (text.length > 40) return 'Title must be at most 40 characters';
  return '';
}

export function validateAmount(value) {
  if (!value.trim()) return 'Amount is required';
  const number = Number(value.replace(',', '.'));
  if (Number.isNaN(number)) return 'Amount must be a number';
  if (number <= 0) return 'Amount must be greater than 0';
  if (number > 1000000) return 'Amount is too large';
  return '';
}

export function validateCategory(value) {
  if (!value) return 'Please choose a category';
  return '';
}

export function validateNote(value) {
  if (value.length > 100) return 'Note must be at most 100 characters';
  return '';
}

// ---------- Profile ----------

export function validateBudget(value) {
  if (!value.trim()) return 'Budget is required';
  const number = Number(value.replace(',', '.'));
  if (Number.isNaN(number)) return 'Budget must be a number';
  if (number <= 0) return 'Budget must be greater than 0';
  return '';
}

export function hasNoErrors(errors) {
  return Object.values(errors).every((message) => message === '');
}
