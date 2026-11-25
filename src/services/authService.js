import { request } from './api';

export function signUp(email, password) {
  return request('/auth/v1/signup', {
    method: 'POST',
    body: { email, password },
  });
}

export function signIn(email, password) {
  return request('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: { email, password },
  });
}

export function refreshSession(refreshToken) {
  return request('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: { refresh_token: refreshToken },
  });
}

export function signOut() {
  return request('/auth/v1/logout', { method: 'POST' });
}

export function updateUserMetadata(data) {
  return request('/auth/v1/user', {
    method: 'PUT',
    body: { data },
  });
}
