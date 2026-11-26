const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatMoney(amount) {
  return `€${Number(amount).toFixed(2)}`;
}

export function toISODate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function parseISODate(text) {
  const [year, month, day] = text.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(text, withYear = false) {
  const date = parseISODate(text);
  const month = MONTHS[date.getMonth()].slice(0, 3);
  return withYear
    ? `${month} ${date.getDate()}, ${date.getFullYear()}`
    : `${month} ${date.getDate()}`;
}

export function formatDateObject(date, withYear = false) {
  return formatDate(toISODate(date), withYear);
}

export function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return {
    from: toISODate(start),
    to: toISODate(nextMonthStart),
    label: `${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
  };
}
