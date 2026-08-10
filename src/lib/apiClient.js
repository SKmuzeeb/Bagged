const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// True once a backend URL is configured — every api/*.js module checks this
// first and callers fall back to local demo data/storage otherwise, so the
// app works fully before a Zippd backend deployment exists.
export const isApiConfigured = Boolean(API_BASE_URL)

const TOKEN_KEY = 'zippd_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Thin fetch wrapper for the Zippd backend: resolves against
 * VITE_API_BASE_URL, sends/parses JSON, attaches a bearer token from
 * localStorage when one exists, and throws ApiError with the backend's
 * `{ error }` message on any non-2xx response.
 */
export async function apiFetch(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const requestHeaders = { 'Content-Type': 'application/json', ...headers }

  if (auth) {
    const token = getToken()
    if (token) requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) return null

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new ApiError(data?.error || 'Something went wrong. Please try again.', response.status)
  }

  return data
}
