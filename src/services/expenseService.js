import { request } from './api';

const TABLE = '/rest/v1/expenses';
const NEWEST_FIRST = 'order=date.desc,created_at.desc';
const RETURN_ROW = { Prefer: 'return=representation' };

// GET - all expenses of the logged-in user
export function getExpenses() {
  return request(`${TABLE}?select=*&${NEWEST_FIRST}`);
}

// GET - expenses with date (used for "this month")
export function getExpensesBetween(from, to) {
  return request(`${TABLE}?select=*&date=gte.${from}&date=lt.${to}&${NEWEST_FIRST}`);
}

// GET - one expense by id
export async function getExpense(id) {
  const rows = await request(`${TABLE}?select=*&id=eq.${id}`);
  if (!rows || rows.length === 0) {
    throw new Error('Expense not found.');
  }
  return rows[0];
}

// POST - create
export async function createExpense(expense) {
  const rows = await request(TABLE, {
    method: 'POST',
    body: expense,
    headers: RETURN_ROW,
  });
  return rows[0];
}

// PATCH - update
export async function updateExpense(id, changes) {
  const rows = await request(`${TABLE}?id=eq.${id}`, {
    method: 'PATCH',
    body: changes,
    headers: RETURN_ROW,
  });
  return rows[0];
}

// DELETE
export function deleteExpense(id) {
  return request(`${TABLE}?id=eq.${id}`, { method: 'DELETE' });
}
