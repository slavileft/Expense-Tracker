import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

let accessToken = null;

let onUnauthorized = () => {};

export function setAccessToken(token) {
  accessToken = token;
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export function getHeaders(extraHeaders = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

function getErrorMessage(data) {
  if (!data) return 'Something went wrong. Please try again.';
  return (
    data.msg ||
    data.error_description ||
    data.message ||
    data.error ||
    'Something went wrong. Please try again.'
  );
}

export async function request(path, { method = 'GET', body, headers } = {}) {
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}${path}`, {
      method,
      headers: getHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error('Network error. Please check your internet connection.');
  }

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 && accessToken) {
      onUnauthorized();
    }
    throw new Error(getErrorMessage(data));
  }

  return data;
}
