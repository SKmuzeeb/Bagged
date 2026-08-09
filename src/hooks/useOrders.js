import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

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

/** Creates an order. Writes to Supabase when configured, otherwise to localStorage. */
export async function createOrder(orderInput) {
  const id = `ORD-${Date.now().toString(36).toUpperCase()}`
  const record = {
    id,
    ...orderInput,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured) {
    try {
      const { items, ...orderRow } = record
      const { data, error } = await supabase.from('orders').insert(orderRow).select().single()
      if (error) throw error

      if (items?.length) {
        await supabase.from('order_items').insert(
          items.map((item) => ({
            order_id: id,
            product_id: item.productId,
            name: item.name,
            name_hindi: item.name_hindi,
            price_rupees: item.price_rupees,
            unit: item.unit,
            quantity: item.quantity,
          }))
        )
      }

      return { ...data, items }
    } catch {
      // Fall through to local storage so the demo never breaks if the
      // Supabase write fails (e.g. RLS misconfiguration, offline, etc.).
    }
  }

  const orders = readLocalOrders()
  orders.unshift(record)
  writeLocalOrders(orders)
  return record
}

export async function getOrderById(id) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .single()
      if (!error && data) return data
    } catch {
      // fall through to local storage
    }
  }
  return readLocalOrders().find((order) => order.id === id) || null
}

export async function updateOrderStatus(id, status) {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id)
      if (!error) return true
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

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false })
        if (!error && data) {
          setOrders(data)
          setLoading(false)
          return
        }
      } catch {
        // fall through to local storage
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
