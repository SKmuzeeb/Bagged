import { apiFetch } from '../apiClient.js'

// Authorization is attached automatically by apiFetch when a session token
// exists, so this doubles as both the guest and signed-in checkout call.
export function createOrder(payload) {
  return apiFetch('/api/orders', { method: 'POST', body: payload })
}

export async function listMyOrders() {
  const { data } = await apiFetch('/api/orders')
  return data
}

export function getOrder(id) {
  return apiFetch(`/api/orders/${id}`, { auth: false })
}

export function updateOrderStatus(id, status) {
  return apiFetch(`/api/orders/${id}/status`, { method: 'PATCH', body: { status } })
}
