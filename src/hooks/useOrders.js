import { useCallback, useEffect, useState } from 'react'
import { isApiConfigured } from '../lib/apiClient.js'
import * as ordersApi from '../lib/api/orders.js'

const LOCAL_ORDERS_KEY = 'tayaar-orders'

function readLocalOrders() {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLocalOrders(orders) {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders))
}

/** Creates an order. Posts to the Zippd API when configured, otherwise to localStorage. */
export async function createOrder(orderInput) {
  const { items, ...orderFields } = orderInput

  if (isApiConfigured) {
    try {
      const order = await ordersApi.createOrder({
        ...orderFields,
        items: items.map((item) => ({
          productId: item.productId ?? null,
          name: item.name,
          description: item.description,
          price_rupees: item.price_rupees,
          unit: item.unit,
          quantity: item.quantity,
        })),
      })
      return order
    } catch {
      // Fall through to local storage so checkout never breaks if the API
      // write fails (backend down, offline, etc.).
    }
  }

  const id = `ORD-${Date.now().toString(36).toUpperCase()}`
  const record = {
    id,
    ...orderInput,
    status: 'pending',
    created_at: new Date().toISOString(),
  }
  const orders = readLocalOrders()
  orders.unshift(record)
  writeLocalOrders(orders)
  return record
}

export async function getOrderById(id) {
  if (isApiConfigured) {
    try {
      const order = await ordersApi.getOrder(id)
      if (order) return order
    } catch {
      // fall through to local storage
    }
  }
  return readLocalOrders().find((order) => order.id === id) || null
}

export async function updateOrderStatus(id, status) {
  if (isApiConfigured) {
    try {
      await ordersApi.updateOrderStatus(id, status)
      return true
    } catch {
      // fall through to local storage
    }
  }
  const orders = readLocalOrders().map((order) => (order.id === id ? { ...order, status } : order))
  writeLocalOrders(orders)
  return true
}

/** Lists all orders for "My orders". */
export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)

    if (isApiConfigured) {
      try {
        const data = await ordersApi.listMyOrders()
        setOrders(data)
        setLoading(false)
        return
      } catch {
        // fall through to local storage (e.g. not signed in yet, offline)
      }
    }

    setOrders(readLocalOrders())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { orders, loading, refresh }
}
