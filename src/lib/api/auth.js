import { apiFetch } from '../apiClient.js'

export function requestMagicLink(email) {
  return apiFetch('/api/auth/magic-link', { method: 'POST', body: { email }, auth: false })
}

export function verifyMagicLink(token) {
  return apiFetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, { auth: false })
}

export function getCurrentUser() {
  return apiFetch('/api/auth/me')
}
